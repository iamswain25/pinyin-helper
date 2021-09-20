import React, { MouseEvent } from "react";
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
  function onMouseOverHandler(ev: MouseEvent) {
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
  }
  function onMouseOutHandler(ev: MouseEvent) {
    const target = ev.target as HTMLElement;
    target.classList.remove("highlight");
    setAside({ ...aside, visible: false });
  }
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
    <section style={{ padding: "2rem", fontSize: "1.2rem" }}>
      <Sidebar />
      <h1>copy paste chinese text below</h1>
      <TextareaAutosize
        value={text}
        onChange={(ev) => setText(ev.target.value)}
        style={{ width: "100%", fontSize: "1.2rem", marginBottom: "1rem" }}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>see pinyin 🔠🔢 on mouse hover 🖱⬇⬇⬇⬇⬇</h2>
      </div>
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
