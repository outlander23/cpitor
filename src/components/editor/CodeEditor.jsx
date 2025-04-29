import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";
import HomePage from "../home/home";

// Improved VS Code-like close icon and tab UX
function TabBar({ files, activePath, onSelect, onClose, onOpen }) {
  const { settings } = useEditor();
  const palette = settings.themeColors[settings.theme];

  // Focus styling for accessibility
  const tabBarRef = useRef(null);

  // Keyboard navigation for tabs (Ctrl+Tab, Ctrl+Shift+Tab)
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Tab") {
        if (!files.length) return;
        e.preventDefault();
        const idx = files.findIndex((f) => f.path === activePath);
        let nextIdx = e.shiftKey
          ? (idx - 1 + files.length) % files.length
          : (idx + 1) % files.length;
        onSelect(files[nextIdx].path);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [files, activePath, onSelect]);

  return (
    <div
      className="flex items-center text-sm h-10 border-b"
      ref={tabBarRef}
      style={{
        background: palette.sidebarBackground,
        borderBottom: `1px solid ${palette.border}`,
        color: palette.sidebarForeground,
        minHeight: "2.5rem",
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
                tabIndex={0}
                className={
                  "flex items-center px-4 py-2 cursor-pointer transition-all duration-100 whitespace-nowrap group border-r" +
                  (isActive ? " font-semibold shadow-inner" : "")
                }
                style={{
                  background: isActive
                    ? palette.lineHighlight
                    : palette.sidebarBackground,
                  color: isActive
                    ? palette.editorForeground
                    : palette.sidebarForeground,
                  borderBottom: isActive
                    ? `2px solid ${palette.navbarBackground}`
                    : "2px solid transparent",
                  outline: isActive
                    ? `1px solid ${palette.navbarBackground}`
                    : "none",
                  marginRight: "-1px",
                  minWidth: "8rem",
                  userSelect: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(file.path);
                  }
                }}
              >
                <span
                  className="truncate max-w-xs mr-2"
                  style={{
                    fontStyle: file.isUnsaved ? "italic" : "normal",
                  }}
                >
                  {file.name}
                  {file.isUnsaved && (
                    <span style={{ color: palette.warnForeground }}>*</span>
                  )}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(file.path);
                  }}
                  className="ml-1 w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/20 group-hover:visible focus:visible outline-none"
                  style={{
                    color: isActive
                      ? palette.editorForeground
                      : palette.sidebarForeground,
                    transition: "background 0.15s",
                  }}
                  aria-label={`Close ${file.name}`}
                  tabIndex={-1}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill={
                        isActive ? palette.sidebarBackground : "transparent"
                      }
                      stroke="none"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 9l6 6m0-6l-6 6"
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
        className="px-3 py-2 flex-shrink-0 transition-colors hover:bg-accent rounded"
        style={{
          color: palette.sidebarForeground,
        }}
        title="Open File"
        aria-label="Open File"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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

export default function CodeEditor() {
  const {
    handleCodeChange,
    saveFile,
    openFiles,
    activeFile,
    setActiveFile,
    closeFile,
    openFileFromLoadscreen,
    settings,
  } = useEditor();

  const code = activeFile ? activeFile.content : "";
  const palette = settings.themeColors[settings.theme];
  const monacoTheme = settings.theme === "light" ? "light" : "vs-dark";

  // Save shortcut (Ctrl+S / Cmd+S)
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
        background: palette.editorBackground,
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
            language={activeFile.language || "cpp"}
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
              scrollbar: { vertical: "auto", horizontal: "auto" },
              roundedSelection: true,
              cursorStyle: "line",
              formatOnType: settings.formatOnType,
              formatOnPaste: settings.formatOnPaste,
              bracketPairColorization: {
                enabled: settings.bracketPairColorization,
              },
              folding: settings.codeFolding,
              smoothScrolling: true,
              mouseWheelZoom: true,
              renderWhitespace: "selection",
              tabSize: settings.tabSize || 4,
              renderIndentGuides: true,
              highlightActiveIndentGuide: true,
              matchBrackets: "always",
              renderFinalNewline: true,
              dragAndDrop: true,
            }}
            className="h-full border-t shadow-lg"
            style={{
              borderColor: palette.border,
              borderTop: `1px solid ${palette.border}`,
            }}
          />
        ) : (
          <HomePage />
        )}
      </div>
    </div>
  );
}
