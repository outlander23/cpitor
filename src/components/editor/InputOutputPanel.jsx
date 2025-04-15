import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

export default function InputOutputPanel() {
  const { 
    inputContent, 
    setInputContent, 
    outputContent, 
    theme 
  } = useEditor();
  
  return (
    <div className="w-60 bg-[#252526] flex flex-col border-l border-[#3c3c3c]">
      {/* Input Section - Top */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center px-2 py-1 bg-[#252526] border-b border-[#3c3c3c]">
          <span className="text-xs font-medium">input.txt</span>
        </div>
        <div className="flex-grow">
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            language="plaintext"
            value={inputContent}
            onChange={setInputContent}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily:
                "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
              automaticLayout: true,
              wordWrap: "on",
              glyphMargin: false,
              folding: false,
              rulers: [],
            }}
            theme={theme}
          />
        </div>
      </div>

      {/* Divider between input and output */}
      <div className="border-t border-[#3c3c3c]"></div>

      {/* Output Section - Bottom */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center px-2 py-1 bg-[#252526] border-b border-[#3c3c3c]">
          <span className="text-xs font-medium">output.txt</span>
        </div>
        <div className="flex-grow">
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            language="plaintext"
            value={outputContent}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily:
                "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
              automaticLayout: true,
              wordWrap: "on",
              glyphMargin: false,
              folding: false,
              readOnly: true,
              rulers: [],
            }}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
