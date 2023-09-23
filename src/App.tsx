import React, { MouseEvent, useCallback } from "react";
import pinyin from "pinyin";
import GraphemeSplitter from "grapheme-splitter";
import TextareaAutosize from "react-textarea-autosize";
import Sidebar from "./Sidebar";
import { useAtom } from "jotai";
import { textAtom } from "./atoms";
const splitter = new GraphemeSplitter();

export default function App() {
  const [text, setText] = useAtom(textAtom);
  const [aside, setAside] = React.useState({
    left: 0,
    top: 0,
    visible: false,
    title: "",
  });
  const onMouseOverHandler = useCallback(
    (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      if (target.tagName === "SPAN" && target.hasAttribute("title")) {
        const title = target.getAttribute("title") || "";
        target.classList.add("highlight");
        setAside({
          left: target.offsetLeft,
          top: target.offsetTop - 80,
          title,
          visible: true,
        });
      }
    },
    [setAside]
  );

  const onMouseOutHandler = useCallback(
    (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      target.classList.remove("highlight");
      setAside((aside) => ({ ...aside, visible: false }));
    },
    [setAside]
  );

  const withPinyin = React.useMemo(() => {
    const split: string[] = splitter.splitGraphemes(text);
    return split.map((ch, i) => {
      const title = pinyin(ch);
      return React.createElement("span", {
        children: ch,
        title,
        key: `key-${i}`,
      });
    });
  }, [text]);
  const { left, top, title, visible } = aside;
  return (
    <section
      style={{
        padding: "2rem",
        fontSize: "1.2rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Sidebar />
      <h1>chinese texts pasted below will...</h1>
      <TextareaAutosize
        value={text}
        onChange={(ev) => setText(ev.target.value)}
        className="shadow"
        style={{
          fontSize: "1.2rem",
          marginBottom: "1rem",
          padding: "1rem",
        }}
      />
      <h2>have pinyin 🔠🔢 on mouse hover 🖱⬇⬇⬇⬇⬇</h2>
      <article
        style={{ whiteSpace: "pre-line", marginTop: "1rem" }}
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
      >
        {withPinyin}
      </article>
      <aside
        className="shadow"
        style={{
          left,
          top,
          position: "absolute",
          backgroundColor: "white",
          padding: "0.5rem",
          fontSize: "3rem",
          borderRadius: "0.5rem",
          visibility: visible ? "visible" : "hidden",
        }}
      >
        {title}
      </aside>
    </section>
  );
}
