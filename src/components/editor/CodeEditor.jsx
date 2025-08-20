"use client";

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

import { TabBar } from "./Tabbar";
import { Breadcrumb } from "./Breadcrumb"; // ← new import

export default function CodeEditor() {
  const {
    handleCodeChange,
    saveFile,
    openFiles,
    activeFile,
    setActiveFilePath,
    closeFile,
    openFileFromLoadscreen,
    settings,
    isRunning,
    compileAndRun,
  } = useEditor();

  const editorRef = useRef(null);

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

  // Keep editor model in sync when activeFile.content changes,
  // but preserve view state (cursor/scroll) to avoid jumping to end.
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const model = ed.getModel();
    if (!model) return;
    const current = ed.getValue();
    const incoming = activeFile?.content ?? "";
    if (current === incoming) return;

    // save view (selection + scroll)
    const viewState = ed.saveViewState();

    // update model value
    model.setValue(incoming);

    // restore view state (if available)
    if (viewState) {
      ed.restoreViewState(viewState);
      ed.focus();
    }
  }, [activeFile?.content, activeFile?.path]);

  // Example breadcrumb path based on activeFile.path (edit for your use case)
  let breadcrumbPath = [];
  if (activeFile?.path) {
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
        onSelect={setActiveFilePath}
        onClose={closeFile}
        onOpen={openFileFromLoadscreen}
        defaultSettings={settings}
        compileAndRun={compileAndRun}
        isRunning={isRunning}
        activeFile={activeFile}
      />

      {/* 2) Breadcrumb path navigator */}
      <Breadcrumb path={breadcrumbPath} />

      {/* 3) Editor or HomePage */}
      <div className="flex-1 relative">
        <Editor
          language={"cpp"}
          defaultValue={code}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(value) => handleCodeChange(value || "")}
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
      </div>
    </div>
  );
}
