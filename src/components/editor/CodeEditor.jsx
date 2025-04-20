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

  // Sync code when active file changes
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

  const renderEditor = () => (
    <Editor
      height="100%"
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
        renderLineHighlight: "line",
        wordWrap: "on",
        cursorBlinking: "smooth",
        padding: { top: 8, bottom: 8 },
        scrollBar: { vertical: "auto", horizontal: "auto" },
      }}
      className="border-t border-gray-700"
    />
  );

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <TabBar
        files={openFiles}
        activePath={activeFile?.path}
        onSelect={setActiveFile}
        onClose={closeFile}
        onOpen={openFileFromLoadscreen}
      />

      <div className="flex-grow relative">
        {activeFile ? (
          renderEditor()
        ) : (
          <WelcomeView onOpen={openFileFromLoadscreen} />
        )}
      </div>
    </div>
  );
}

// TabBar Component
function TabBar({ files, activePath, onSelect, onClose, onOpen }) {
  return (
    <div className="flex items-center bg-gray-800 border-b border-gray-700 text-sm h-10">
      <div className="flex-1 flex overflow-x-auto">
        {files.length === 0 ? (
          <div className="px-4 text-gray-500">No files open</div>
        ) : (
          files.map((file) => (
            <div
              key={file.path}
              onClick={() => onSelect(file.path)}
              className={`flex items-center px-4 cursor-pointer transition-colors whitespace-nowrap 
                ${
                  activePath === file.path
                    ? "bg-gray-900 text-white font-medium border-b-2 border-blue-500"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="truncate max-w-xs">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(file.path);
                }}
                className="ml-2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-white"
                aria-label={`Close ${file.name}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
      <button
        onClick={onOpen}
        className="px-3 flex-shrink-0 text-gray-400 hover:text-white hover:bg-gray-800"
        title="Open File"
      >
        +
      </button>
    </div>
  );
}

// Welcome view placeholder
function WelcomeView({ onOpen }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
      <h2 className="text-2xl mb-4">Welcome to Your C++ Editor</h2>
      <button
        onClick={onOpen}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Open C++ File
      </button>
    </div>
  );
}
