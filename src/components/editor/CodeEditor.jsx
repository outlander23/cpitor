"use client";

import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";
import HomePage from "../home/home";
import { TabBar } from "./Tabbar";
import { Breadcrumb } from "./Breadcrumb"; // ← new import

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

  // Example breadcrumb path based on activeFile.path (edit for your use case)
  let breadcrumbPath = [];
  if (activeFile?.path) {
    // e.g. "pages/index.vue/template/div"
    breadcrumbPath = activeFile.path.split("/").filter(Boolean);
  } else {
    breadcrumbPath = [];
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: palette.editorBackground,
        color: palette.editorForeground,
      }}
    >
      {/* 1) VS Code-style Tab Bar */}
      <TabBar
        files={openFiles}
        activePath={activeFile?.path}
        onSelect={setActiveFile}
        onClose={closeFile}
        onOpen={openFileFromLoadscreen}
        defaultSettings={settings}
      />

      {/* 2) Breadcrumb path navigator */}
      <Breadcrumb path={breadcrumbPath} />

      {/* 3) Editor or HomePage */}
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
            style={{
              borderTop: `1px solid ${palette.border}`,
              background: palette.editorBackground,
            }}
          />
        ) : (
          <HomePage />
        )}
      </div>
    </div>
  );
}
