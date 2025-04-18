import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

export default function CodeEditor() {
  const { code, handleCodeChange, theme, saveFile } = useEditor();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault(); // Stop browser from saving the webpage
        console.log("Saving file...");
        saveFile(); // Your custom save function
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveFile]);

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
