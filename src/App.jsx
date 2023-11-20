import React, { useState } from "react";
import Editor from "./components/Editor";
import ImageDropZone from "./components/ImageUploader";
import "./App.css";

function App() {
  // const [editorHtmlValue, setEditorHtmlValue] = useState("");
  // const [editorMarkdownValue, setEditorMarkdownValue] = useState("");

  // const onEditorContentChanged = (content) => {
  //   console.log(content);
  //   setEditorHtmlValue(content.html);
  //   setEditorMarkdownValue(content.markdown);
  // };

  // console.log(editorMarkdownValue);

  return (
    <div className="App">
      <div>
        <h1>ReactQuill editor with markdown import/export</h1>
        <p>The is the ReactQuill based editor.</p>
        <Editor />
      </div>

      <div>
        <h1>Multiple Image Upload with Preview and Crop</h1>
        <ImageDropZone className="drop-zone" />
      </div>
    </div>
  );
}

export default App;
