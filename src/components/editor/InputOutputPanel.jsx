import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

export default function InputOutputPanel() {
  const { inputContent, setInputContent, outputContent, theme } = useEditor();

  const isDark = theme === "vs-dark" || theme === "dark";

  return (
    <div
      className={`min-w-[420px] flex flex-col h-full overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      } border-l`}
    >
      {/* Input Section */}
      <div
        className={`flex-1 flex flex-col overflow-hidden border-b transition-colors ${
          isDark ? "border-zinc-800" : "border-zinc-200"
        }`}
      >
        <div
          className={`px-4 py-2 transition-colors ${
            isDark ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-800"
          }`}
        >
          <span className="text-xs font-semibold tracking-wide">Input</span>
        </div>
        <div className="flex-grow overflow-hidden">
          <Editor
            defaultLanguage="plaintext"
            language="plaintext"
            value={inputContent}
            onChange={setInputContent}
            theme={isDark ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
              scrollBeyondLastLine: false,
              fontSize: 13,
              fontFamily:
                "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
              automaticLayout: true,
              wordWrap: "on",
              glyphMargin: false,
              folding: false,
              rulers: [],
              placeholder: "Enter input data here...",
            }}
          />
        </div>
      </div>

      {/* Output Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className={`px-4 py-2 border-b transition-colors ${
            isDark
              ? "bg-zinc-800 border-zinc-800 text-white"
              : "bg-zinc-100 border-zinc-200 text-zinc-800"
          }`}
        >
          <span className="text-xs font-semibold tracking-wide">Output</span>
        </div>
        <div className="flex-grow overflow-hidden">
          <Editor
            defaultLanguage="plaintext"
            language="plaintext"
            value={outputContent}
            theme={isDark ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
              scrollBeyondLastLine: false,
              fontSize: 13,
              fontFamily:
                "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
              automaticLayout: true,
              wordWrap: "on",
              glyphMargin: false,
              folding: false,
              readOnly: true,
              rulers: [],
              placeholder: "Program output will appear here...",
            }}
          />
        </div>
      </div>
    </div>
  );
}
