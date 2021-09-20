import React, { MouseEvent } from "react";
import pinyin from "pinyin";
import GraphemeSplitter from "grapheme-splitter";
import TextareaAutosize from "react-textarea-autosize";
const defaultText = `漁父辭
屈原旣放, 游於江潭, 行吟澤畔. 顔色憔悴, 形容枯槁. 漁父見而問之曰,
子非三閭大夫與. 何故至於斯. 屈原曰, 擧世皆濁, 我獨淸. 衆人皆醉, 我獨醒.
是以見放. 漁父曰, 聖人不凝滯於物, 而能與世推移. 世人皆濁,
何不淈其泥而揚其波. 衆人皆醉, 何不餔其糟而歠其醨. 何故深思高擧,
自令放爲. 屈原曰, 吾聞之. 新沐者必彈冠, 新浴者必振衣. 安能以身之察察,
受物之汶汶者乎. 寧赴湘流葬於江魚之腹中, 安能以皓皓之白,
而蒙世俗之塵埃乎. 漁父莞爾而笑, 鼓枻而去. 乃歌曰, 滄浪之水淸兮,
可以濯吾纓. 滄浪之水濁兮, 可以濯吾足. 遂去不復與言.`;
const splitter = new GraphemeSplitter();

export default function App() {
  const [text, setText] = React.useState(defaultText);
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
      <TextareaAutosize
        value={text}
        onChange={(ev) => setText(ev.target.value)}
        style={{ width: "100%", fontSize: "1.2rem" }}
      />
      <article
        style={{ whiteSpace: "pre-line" }}
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
      >
        {withPinyin}
      </article>
      <aside
        style={{
          left,
          top,
          position: "absolute",
          boxShadow: "0 0 1rem rgba(0,0,0,0.2)",
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
