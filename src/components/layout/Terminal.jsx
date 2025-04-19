import { useEffect, useRef, useState } from "react";
import { FaTerminal, FaPlay, FaTrash, FaSpinner } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";
import { invoke } from "@tauri-apps/api/core";

export default function Terminal() {
  const {
    terminalOutput,
    updateTerminalOutput,
    activeFile,
    inputContent,
    setOutputContent,
  } = useEditor();
  const [isRunning, setIsRunning] = useState(false);
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

  const compileAndRun = async () => {
    if (!activeFile || !activeFile.path.endsWith(".cpp")) {
      updateTerminalOutput(
        `${terminalOutput}\n❌ Error: No C++ file selected or invalid file type\n`
      );
      return;
    }
    setIsRunning(true);

    try {
      const response = await invoke("compile_and_run_cpp", {
        filePath: activeFile.path,
        input: inputContent,
      });

      const result =
        typeof response === "string" ? JSON.parse(response) : response;

      const output = result.output.trim();
      const stage = result.stage;
      const success = result.success;

      if (success) {
        if (stage === "compilation") {
          updateTerminalOutput(
            (prev) => `${prev}\n✅ Compilation successful. Executing...\n`
          );
        } else if (stage === "execution") {
          updateTerminalOutput((prev) => `${prev}\n🎉 Execution Output:\n\n`);
          setOutputContent(output);
        }
      } else {
        if (stage === "compilation") {
          updateTerminalOutput((prev) => `${prev}\n❌ Compilation failed:\n\n`);
        } else if (stage === "execution") {
          updateTerminalOutput((prev) => `${prev}\n💥 Runtime error:\n\n`);
        }
        setOutputContent(output);
      }
    } catch (error) {
      console.error("Runtime error:", error);
      updateTerminalOutput(
        (prev) => `${prev}\n❌ Unexpected error:\n${error}\n`
      );
    } finally {
      setIsRunning(false);
    }
  };
  // Clear terminal output
  const clearTerminal = () => {
    updateTerminalOutput("");
    setOutputContent("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-t border-gray-700 shadow-lg">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FaTerminal className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-200">TERMINAL</span>
          {activeFile && (
            <span className="text-xs text-gray-400">
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
                ? "text-gray-600 cursor-not-allowed"
                : "text-green-400 hover:bg-gray-700 hover:text-green-300"
            }`}
            title="Run C++ File"
            aria-label="Run C++ File"
          >
            {isRunning ? <FaSpinner className="animate-spin" /> : <FaPlay />}
          </button>
          <button
            onClick={clearTerminal}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200"
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
        className="flex-grow overflow-y-auto p-4 font-mono text-sm bg-gray-900 text-gray-200"
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
