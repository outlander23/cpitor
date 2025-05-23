"use client";

import { ChevronRight, X as CloseIcon } from "lucide-react";
import { FaTerminal, FaPlay, FaTrash, FaSpinner } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "../../context/EditorContext";

export default function Terminal() {
  const {
    terminalOutput,
    activeFile,
    theme,
    compileAndRun,
    isRunning,
    clearTerminal,
  } = useEditor();

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("terminal");

  const terminalRef = useRef(null);

  // scroll to bottom when new output arrives and panel is open
  useEffect(() => {
    if (isExpanded && activeTab === "terminal" && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput, isExpanded, activeTab]);

  // split the raw output into lines
  const terminalLines = terminalOutput
    ? terminalOutput.split(/\r?\n/).filter((l) => l.length > 0)
    : [];

  // prepare tabs
  const tabs = [{ id: "terminal", title: "Terminal", content: terminalLines }];

  const active = tabs.find((t) => t.id === activeTab) || tabs[0];

  // theme classes
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
      {/* Header: tabs + controls */}
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
            {tab.id === "problems" && tab.content.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-500 rounded-full text-[10px] text-white">
                {tab.content.length}
              </span>
            )}
          </div>
        ))}
        <div className="ml-auto px-2">
          <button
            onClick={() => {
              clearTerminal();
            }}
            className={`p-2 rounded-full transition-colors duration-200 text-red-500 hover:bg-gray-300 hover:text-red-600`}
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
        ref={terminalRef}
        className={`flex-1 overflow-auto p-2 font-mono text-sm ${bg} ${fg}`}
      >
        {/* Terminal tab */}
        {active.id === "terminal" && (
          <div>
            <div className="flex items-center mb-2"></div>
            {active.content.map((line, idx) => (
              <div key={idx} className="text-gray-300">
                {line}
              </div>
            ))}
            {isRunning && (
              <span className="text-xs text-yellow-400 animate-pulse mt-2 inline-block">
                ⏳ Running...
              </span>
            )}
          </div>
        )}

        {/* Problems tab */}
        {active.id === "problems" && (
          <div>
            {active.content.length ? (
              active.content.map((line, idx) => (
                <div key={idx} className={fg}>
                  {line}
                </div>
              ))
            ) : (
              <div className={`text-xs ${fg}`}>No problems</div>
            )}
          </div>
        )}

        {/* Debug Console tab */}
        {active.id === "debug" && (
          <div className={`text-xs ${fg}`}>Nothing to show</div>
        )}

        {/* Output tab */}
        {active.id === "output" && (
          <pre className={`whitespace-pre-wrap ${fg}`}>
            {terminalOutput || "No output"}
          </pre>
        )}
      </div>

      {/* Footer: run & clear actions (optional) */}
    </div>
  );
}
