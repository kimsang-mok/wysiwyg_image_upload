import { useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import * as Emoji from "quill-emoji";
import { htmlToMarkdown } from "../utils/parser";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

Quill.register("modules/emoji", Emoji);

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote", "link"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["emoji"],
  ["clean"],
];

function Editor() {
  //   const [value, setValue] = useState(markdownToHtml(props.value || ""));
  const [value, setValue] = useState("");
  const reactQuillRef = useRef(null);
  const onChange = (content) => {
    setValue(content);
  };

  function handleFormSubmit(text) {
    const convertedText = htmlToMarkdown(text);
    console.log(convertedText);
    setValue("");
  }

  return (
    <>
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        placeholder="Start writing..."
        modules={{
          toolbar: {
            container: TOOLBAR_OPTIONS,
          },
          "emoji-toolbar": true,
          "emoji-textarea": false,
          "emoji-shortname": true,
        }}
        value={value}
        // style={{ height: "auto", max-height: "200px", overflow: "auto"; }}
        onChange={onChange}
        className="editor"
      />
      <button type="button" onClick={() => handleFormSubmit(value)}>
        Save
      </button>
    </>
  );
}

export default Editor;
