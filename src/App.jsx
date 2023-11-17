import React, { useState } from "react";
import Editor from "./components/Editor";
import ImageDropZone from "./components/ImageUploader";
import "./App.css";

const initialMarkdownContent = "**StartInitial** writing *something*...";

function App() {
  const [editorHtmlValue, setEditorHtmlValue] = useState("");
  const [editorMarkdownValue, setEditorMarkdownValue] = useState("");

  const onEditorContentChanged = (content) => {
    setEditorHtmlValue(content.html);
    setEditorMarkdownValue(content.markdown);
  };

  // console.log(editorMarkdownValue);

  return (
    <div className="App">
      <h1>ReactQuill editor with markdown import/export</h1>

      <p>The is the ReactQuill based editor.</p>

      <Editor
        value={initialMarkdownContent}
        onChange={onEditorContentChanged}
      />

      <div>
        <h1>Multiple Image Upload with Preview and Crop</h1>
        <ImageDropZone className="drop-zone" />
      </div>
    </div>
  );
}

export default App;
