import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

export default function CodeEditor() {
  const {
    code,
    handleCodeChange,
    theme,
    saveFile,
    openFiles,
    activeFile,
    setActiveFile,
    closeFile,
    addFile,
  } = useEditor();

  // Log for debugging
  console.log("CodeEditor rendered");
  console.log("Active file:", activeFile);
  console.log("Open files:", openFiles);

  // Sync code with active file
  useEffect(() => {
    if (activeFile && openFiles.length > 0) {
      const file = openFiles.find((f) => f.path === activeFile.path);
      if (file && file.content !== code) {
        handleCodeChange(file.content);
      }
    }
  }, [activeFile, openFiles, code, handleCodeChange]);

  // Save file with Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveFile();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveFile]);

  // Function to open a file
  const openFile = async () => {
    const selected = await open({
      multiple: false,
      filters: [
        { name: "Code Files", extensions: ["cpp", "py", "js", "ts", "json"] },
      ],
    });
    if (selected) {
      const content = await readTextFile(selected);
      addFile({ path: selected, name: selected.split("/").pop(), content });
      setActiveFile(selected);
    }
  };

  // Determine editor content
  const editorContent = activeFile
    ? code
    : "// Select or open a file to start editing";

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Tabs for open files */}
      <div className="flex items-center bg-[#252526] text-white text-sm overflow-x-auto border-b border-[#3c3c3c]">
        {openFiles.length === 0 ? (
          <div className="px-4 py-2 text-gray-400">No open files</div>
        ) : (
          openFiles.map((file) => (
            <div
              key={file.path}
              onClick={() => setActiveFile(file.path)}
              className={`flex items-center px-4 py-2 cursor-pointer border-b-2 transition-colors ${
                activeFile?.path === file.path
                  ? "bg-[#1e1e1e] border-blue-500 font-semibold text-white"
                  : "border-transparent hover:bg-[#2d2d2d] text-gray-300"
              }`}
            >
              <span className="mr-2">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent switching when closing
                  closeFile(file.path);
                }}
                className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 rounded-full"
                aria-label={`Close ${file.name}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Monaco Editor or Placeholder */}
      <div className="flex-grow relative">
        {activeFile ? (
          <Editor
            height="100%"
            defaultLanguage="cpp"
            language={detectLanguage(activeFile.name)}
            value={editorContent}
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
              bracketPairColorization: { enabled: true },
              renderLineHighlight: "all",
              wordWrap: "on",
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              padding: { top: 10 },
              scrollBar: {
                vertical: "auto",
                horizontal: "auto",
              },
            }}
            theme={theme}
            className="border-t border-[#3c3c3c]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <div className="text-2xl mb-4">Welcome to Your Code Editor</div>
            <button
              onClick={openFile}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Open a File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function detectLanguage(fileName) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "cpp":
    case "c":
    case "h":
      return "cpp";
    case "py":
      return "python";
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "json":
      return "json";
    default:
      return "cpp"; // Fallback to C++ as per your example
  }
}
