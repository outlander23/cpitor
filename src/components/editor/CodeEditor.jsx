"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

import { TabBar } from "./Tabbar";
import { Breadcrumb } from "./Breadcrumb";

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
    theme,
    compileAndRun,
  } = useEditor();

  const editorRef = useRef(null);
  const [code, setCode] = useState("");

  const palette = settings.themeColors[theme];
  const monacoTheme = theme === "light" ? "light" : "vs-dark";

  useEffect(() => {
    setCode(activeFile?.content ?? "");
  }, [activeFile]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        saveFile();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saveFile]);

  let breadcrumbPath = [];
  if (activeFile?.path) {
    breadcrumbPath = activeFile.path.split("/").filter(Boolean);
  }

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
        onSelect={setActiveFilePath}
        onClose={closeFile}
        onOpen={openFileFromLoadscreen}
        defaultSettings={settings}
        compileAndRun={compileAndRun}
        isRunning={isRunning}
        activeFile={activeFile}
        theme={theme}
      />

      <Breadcrumb path={breadcrumbPath} />

      <div className="flex-1 relative">
        <Editor
          language={activeFile?.path?.endsWith(".cpp") ? "cpp" : "plaintext"}
          value={code}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(value) => {
            const v = value || "";
            setCode(v);
            handleCodeChange(v);
          }}
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
