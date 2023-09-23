import { useAtom } from "jotai";
import React from "react";
import { sidebarVisibleAtom, textAtom } from "./atoms";
import * as texts from "./texts";

export default function Sidebar() {
  const [visible, setVisible] = useAtom(sidebarVisibleAtom);
  console.log({ visible });
  return (
    <div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
        }}
      >
        Other examples
      </button>
      {visible && <OtherExamples />}
    </div>
  );
}

function OtherExamples() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, setVisible] = useAtom(sidebarVisibleAtom);
  function eventHandler(ev: MouseEvent) {
    const tg = ev.target as HTMLElement;
    const contain = ref.current?.contains(tg);
    if (!contain) {
      setVisible(false);
    }
  }
  React.useEffect(() => {
    window.addEventListener("click", eventHandler);
    return () => window.removeEventListener("click", eventHandler);
    // eslint-disable-next-line
  }, []);
  return (
    <section
      ref={ref}
      className="shadow"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "white",
        padding: "1rem",
      }}
    >
      <h1>Other examples</h1>
      <ul className="clickable-li">
        {Object.values(texts).map((text, index) => (
          <Li text={text} key={index} />
        ))}
      </ul>
    </section>
  );
}

function Li(props: { text: string }) {
  const { text } = props;
  const title = text.substr(0, text.indexOf("\n"));
  const [selectedText, updateText] = useAtom(textAtom);
  const [, setVisible] = useAtom(sidebarVisibleAtom);
  return (
    <li
      onClick={() => {
        updateText(text);
        setVisible(false);
      }}
      style={{ fontWeight: selectedText === text ? "bold" : "normal" }}
    >
      {title}
    </li>
  );
}
