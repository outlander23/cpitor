"use client";

import { X as CloseIcon } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "../../context/EditorContext";

import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { spawn } from "tauri-pty";
import "xterm/css/xterm.css";

export default function Terminal() {
  const { theme, clearTerminal } = useEditor();

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("terminal");

  const xtermContainerRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const ptyRef = useRef(null);

  useEffect(() => {
    if (!xtermContainerRef.current) return;

    // 1. Create terminal
    const term = new XTerminal({
      cursorBlink: true,
      convertEol: true,
      fontSize: 14,
      theme:
        theme === "dark"
          ? { background: "#1e1e1e", foreground: "#d4d4d4" }
          : { background: "#f9f9f9", foreground: "#333333" },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xtermContainerRef.current);
    fitAddon.fit();

    // 2. Pick system shell
    const platform = window.__TAURI__?.os?.platform?.() ?? "unix";
    const shell = platform === "win32" ? "powershell.exe" : "/bin/bash";
    console.log(shell);
    // 3. Spawn PTY (real shell)
    const pty = spawn(shell, [], {
      cols: term.cols,
      rows: term.rows,
      cwd: ".",
    });

    // 4. Hook data streams
    pty.onData((data) => term.write(data));
    term.onData((data) => pty.write(data));

    // 5. Resize handling
    const resizeListener = () => fitAddon.fit();
    window.addEventListener("resize", resizeListener);
    term.onResize((size) => pty.resize(size.cols, size.rows));

    term.writeln("🚀 Interactive terminal started");

    // Save refs
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
    ptyRef.current = pty;

    return () => {
      term.dispose();
      pty.kill?.();
      window.removeEventListener("resize", resizeListener);
    };
  }, [theme]);

  // Tabs
  const tabs = [{ id: "terminal", title: "Terminal", content: [] }];
  const active = tabs.find((t) => t.id === activeTab) || tabs[0];

  // Theme classes
  const bg = theme === "dark" ? "bg-[#1e1e1e]" : "bg-[#f9f9f9]";
  const fg = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const headerBg = theme === "dark" ? "bg-[#252526]" : "bg-[#e5e7eb]";
  const headerBorder =
    theme === "dark" ? "border-[#1e1e1e]" : "border-gray-300";
  const iconColor = theme === "dark" ? "text-gray-400" : "text-gray-700";
  const activeTabBg =
    theme === "dark" ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800";
  const inactiveTabBg =
    theme === "dark"
      ? "bg-[#2d2d2d] text-gray-400 hover:bg-[#2a2a2a]"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div
      className={`flex flex-col h-full border-t ${headerBorder} shadow-lg ${bg}`}
    >
      {/* Header */}
      <div className={`flex items-center border-b ${headerBorder} ${headerBg}`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center h-9 px-3 text-xs cursor-pointer border-r ${headerBorder} ${
              tab.id === activeTab ? activeTabBg : inactiveTabBg
            }`}
          >
            <span>{tab.title}</span>
          </div>
        ))}
        <div className="ml-auto px-2 flex">
          <button
            onClick={() => {
              xtermRef.current?.clear();
              clearTerminal();
            }}
            className="p-2 rounded-full transition-colors duration-200 text-red-500 hover:bg-gray-300 hover:text-red-600"
            title="Clear"
            aria-label="Clear"
          >
            <FaTrash />
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className={`p-1 rounded-sm hover:bg-gray-300 transition-colors ${iconColor}`}
            aria-label="Collapse"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex-1 overflow-hidden p-1 font-mono text-sm ${bg} ${fg}`}
      >
        {active.id === "terminal" && (
          <div ref={xtermContainerRef} className="w-full h-full rounded" />
        )}
      </div>
    </div>
  );
}
