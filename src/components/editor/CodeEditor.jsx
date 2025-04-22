import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

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
    openFileFromLoadscreen,
  } = useEditor();

  // Sync editor content with active file
  useEffect(() => {
    if (!activeFile) return;
    const file = openFiles.find((f) => f.path === activeFile.path);
    if (file && file.content !== code) {
      handleCodeChange(file.content);
    }
  }, [activeFile, openFiles, code, handleCodeChange]);

  // Save file on Ctrl+S / Cmd+S
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveFile();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saveFile]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <TabBar
        files={openFiles}
        activePath={activeFile?.path}
        onSelect={setActiveFile}
        onClose={closeFile}
        onOpen={openFileFromLoadscreen}
      />
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            language="cpp"
            value={code}
            onChange={handleCodeChange}
            theme={theme}
            options={{
              automaticLayout: true,
              fontSize: 14,
              fontFamily: "'Cascadia Code', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "all",
              wordWrap: "on",
              cursorBlinking: "smooth",
              padding: { top: 16, bottom: 16 },
              scrollBar: { vertical: "auto", horizontal: "auto" },
              roundedSelection: true,
              cursorStyle: "line",
            }}
            className="border-t border-gray-800 shadow-lg"
          />
        ) : (
          <WelcomeView onOpen={openFileFromLoadscreen} />
        )}
      </div>
    </div>
  );
}

function TabBar({ files, activePath, onSelect, onClose, onOpen }) {
  return (
    <div className="flex items-center bg-gray-800 border-b border-gray-700 text-sm h-12">
      <div className="flex-1 flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {files.length === 0 ? (
          <div className="px-4 py-2 text-gray-400 italic">No files open</div>
        ) : (
          files.map((file) => (
            <div
              key={file.path}
              onClick={() => onSelect(file.path)}
              role="tab"
              aria-selected={activePath === file.path}
              className={`flex items-center px-4 py-2 cursor-pointer transition-all duration-200 whitespace-nowrap
                ${
                  activePath === file.path
                    ? "bg-gray-900 text-white font-medium border-b-2 border-blue-500"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
            >
              <span className="truncate max-w-xs">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(file.path);
                }}
                className="ml-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
                aria-label={`Close ${file.name}`}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
      <button
        onClick={onOpen}
        className="px-3 py-2 flex-shrink-0 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        title="Open File"
        aria-label="Open File"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}

function WelcomeView({ onOpen }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <h2 className="text-3xl font-semibold mb-6">
        Welcome to Your C++ Editor
      </h2>
      <button
        onClick={onOpen}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Open C++ File"
      >
        Open C++ File
      </button>
    </div>
  );
}
