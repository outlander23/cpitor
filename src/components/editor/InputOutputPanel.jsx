import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

export default function InputOutputPanel() {
  const { inputContent, setInputContent, outputContent, theme } = useEditor();

  return (
    <div className="min-w-[420px] bg-[#1e1e1e] border-l border-[#3c3c3c] flex flex-col h-full overflow-hidden">
      {/* Input Section */}
      <div className="flex-1 flex flex-col overflow-hidden border-b border-[#3c3c3c]">
        <div className="px-3 py-2 bg-[#2d2d2d]">
          <span className="text-xs font-semibold text-white tracking-wide">
            Input
          </span>
        </div>
        <div className="flex-grow overflow-hidden">
          <Editor
            defaultLanguage="plaintext"
            language="plaintext"
            value={inputContent}
            onChange={setInputContent}
            theme={theme}
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
            }}
          />
        </div>
      </div>

      {/* Output Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 py-2 bg-[#2d2d2d] border-b border-[#3c3c3c]">
          <span className="text-xs font-semibold text-white tracking-wide">
            Output
          </span>
        </div>
        <div className="flex-grow overflow-hidden">
          <Editor
            defaultLanguage="plaintext"
            language="plaintext"
            value={outputContent}
            theme={theme}
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
            }}
          />
        </div>
      </div>
    </div>
  );
}
