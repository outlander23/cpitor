import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor({ value, onChange, language = "cpp" }) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // Configure C/C++ specific settings if needed
    monaco.languages.cpp.cppDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowJs: true,
    });
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage={language}
      defaultValue={value || "// Start coding here"}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        automaticLayout: true,
      }}
      theme="vs-dark"
    />
  );
}

export default CodeEditor;
