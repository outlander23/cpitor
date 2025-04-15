import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

export default function CodeEditor() {
  const { code, handleCodeChange, theme } = useEditor();
  
  return (
    <div className="flex-grow">
      <Editor
        height="100%"
        defaultLanguage="cpp"
        language="cpp"
        value={code}
        onChange={handleCodeChange}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily:
            "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
          automaticLayout: true,
          lineNumbers: "on",
          rulers: [],
          bracketPairColorization: true,
          renderLineHighlight: "line",
          wordWrap: "on",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
        }}
        theme={theme}
      />
    </div>
  );
}
