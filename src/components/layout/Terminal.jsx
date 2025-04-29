import { useEffect, useRef, useState } from "react";
import { FaTerminal, FaPlay, FaTrash, FaSpinner } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";
import { invoke } from "@tauri-apps/api/core";

export default function Terminal() {
  const {
    terminalOutput,
    activeFile,
    theme,
    compileAndRun,
    isRunning,
    clearTerminal,
  } = useEditor();

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // set theme colors
  const terminalBg = theme === "dark" ? "bg-[#1e1e1e]" : "bg-[#f9f9f9]";
  const terminalText = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const terminalHeaderBg = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
  const terminalHeaderBorder =
    theme === "dark" ? "border-gray-700" : "border-gray-300";
  const terminalIcon = theme === "dark" ? "text-gray-400" : "text-gray-700";
  const terminalTitle = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const terminalSubTitle = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`flex flex-col h-full ${terminalBg} border-t ${terminalHeaderBorder} shadow-lg`}
    >
      {/* Terminal Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 ${terminalHeaderBg} border-b ${terminalHeaderBorder}`}
      >
        <div className="flex items-center space-x-2">
          <FaTerminal className={terminalIcon} />
          <span className={`text-sm font-semibold ${terminalTitle}`}>
            TERMINAL
          </span>
          {activeFile && (
            <span className={`text-xs ${terminalSubTitle}`}>
              ({activeFile.name || "No file selected"})
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={compileAndRun}
            disabled={isRunning || !activeFile}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isRunning || !activeFile
                ? "text-gray-400 cursor-not-allowed"
                : "text-green-500 hover:bg-gray-300 hover:text-green-600"
            }`}
            title="Run C++ File"
            aria-label="Run C++ File"
          >
            {isRunning ? <FaSpinner className="animate-spin" /> : <FaPlay />}
          </button>
          <button
            onClick={clearTerminal}
            className={`p-2 rounded-full ${terminalIcon} hover:bg-gray-300 hover:${terminalTitle} transition-colors duration-200`}
            title="Clear Terminal"
            aria-label="Clear Terminal"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className={`flex-grow overflow-y-auto p-4 font-mono text-sm ${terminalBg} ${terminalText}`}
      >
        <pre className="whitespace-pre-wrap leading-relaxed">
          {terminalOutput || "Terminal ready. Select a C++ file to run."}
        </pre>
        {isRunning && (
          <span className="text-xs text-yellow-400 animate-pulse mt-2 inline-block">
            ⏳ Running...
          </span>
        )}
      </div>
    </div>
  );
}
