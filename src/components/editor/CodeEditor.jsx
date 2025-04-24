import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";
import HomePage from "../home/home";
import NoCodeScreen from "./NoCodeScreen";
export default function CodeEditor() {
  const {
    code,
    handleCodeChange,
    saveFile,
    openFiles,
    activeFile,
    setActiveFile,
    closeFile,
    openFileFromLoadscreen,
    settings,
  } = useEditor();

  // derive palette & correct monaco theme from settings
  const palette = settings.themeColors[settings.theme];
  // Monaco’s built‑in light theme is "vs-light" (not "light")
  const monacoTheme = settings.theme === "light" ? "light" : "vs-dark";

  console.log("CodeEditor render", monacoTheme);
  // Sync editor content with active file
  useEffect(() => {
    if (!activeFile) return;
    const file = openFiles.find((f) => f.path === activeFile.path);
    if (file && file.content !== code) {
      handleCodeChange(file.content);
    }
  }, [activeFile, openFiles, code, handleCodeChange, settings.theme]);

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
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: palette.editorBackground,
        color: palette.editorForeground,
      }}
    >
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
            theme={monacoTheme}
            options={{
              automaticLayout: true,
              fontSize: settings.fontSizes.codeEditor,
              fontFamily: settings.fontFamily,
              minimap: { enabled: settings.minimap },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "all",
              wordWrap: "on",
              cursorBlinking: "smooth",
              padding: { top: 10, bottom: 8 },
              scrollBar: { vertical: "auto", horizontal: "auto" },
              roundedSelection: true,
              cursorStyle: "line",
              formatOnType: settings.formatOnType,
              formatOnPaste: settings.formatOnPaste,
              bracketPairColorization: {
                enabled: settings.bracketPairColorization,
              },
              folding: settings.codeFolding,
            }}
            className="h-full border-t shadow-lg"
            style={{ borderColor: palette.border }}
          />
        ) : (
          <HomePage />
        )}
      </div>
    </div>
  );
}
function TabBar({ files, activePath, onSelect, onClose, onOpen }) {
  const { settings } = useEditor();
  const palette = settings.themeColors[settings.theme];

  console.log(palette);

  return (
    <div
      className="flex items-center text-sm h-12"
      style={{
        backgroundColor: palette.sidebarBackground,
        borderBottom: `1px solid ${palette.border}`,
        color: palette.sidebarForeground,
      }}
    >
      <div
        className="flex-1 flex overflow-x-auto scrollbar-thin"
        style={{
          scrollbarColor: `${palette.gutterForeground} ${palette.gutterBackground}`,
        }}
      >
        {files.length === 0 ? (
          <div
            className="px-4 py-2 italic"
            style={{ color: palette.gutterForeground }}
          >
            No files open
          </div>
        ) : (
          files.map((file) => {
            const isActive = activePath === file.path;
            return (
              <div
                key={file.path}
                onClick={() => onSelect(file.path)}
                role="tab"
                aria-selected={isActive}
                className="flex items-center px-4 py-2 cursor-pointer transition-all duration-200 whitespace-nowrap"
                style={{
                  backgroundColor: isActive
                    ? palette.lineHighlight
                    : "transparent",
                  color: isActive
                    ? palette.editorForeground
                    : palette.sidebarForeground,
                  borderBottom: isActive
                    ? `2px solid ${palette.navbarBackground}`
                    : "none",
                }}
              >
                <span className="truncate max-w-xs">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(file.path);
                  }}
                  className="ml-2 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
                  style={{
                    color: palette.sidebarForeground,
                    backgroundColor: isActive
                      ? palette.lineHighlight
                      : "transparent",
                  }}
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
            );
          })
        )}
      </div>

      <button
        onClick={onOpen}
        className="px-3 py-2 flex-shrink-0 transition-colors"
        style={{ color: palette.sidebarForeground }}
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
