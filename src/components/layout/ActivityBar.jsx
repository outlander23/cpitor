import React from "react";
import {
  FaHome,
  FaFolderOpen,
  FaSearch,
  FaTerminal,
  FaPlay,
  FaCog,
} from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function ActivityBar() {
  const { showFileExplorer, toggleFileExplorer, changeView, activeView } =
    useEditor();

  // Updated handlers that change the active view
  const goHome = () => changeView("home");
  const openSettings = () => changeView("settings");
  const openEditor = () => changeView("editor");

  return (
    <div
      className="
        flex flex-col justify-between
        w-12 h-screen overflow-hidden
        bg-gray-800
      "
    >
      {/* Top group: never shrink */}
      <div className="flex-shrink-0 flex flex-col items-center space-y-6 py-4">
        <ActivityButton
          title="Home"
          active={activeView === "home"}
          onClick={goHome}
        >
          <FaHome className="w-5 h-5" />
        </ActivityButton>

        <ActivityButton
          title="Explorer"
          active={showFileExplorer && activeView === "editor"}
          onClick={() => {
            toggleFileExplorer();
            openEditor();
          }}
        >
          <FaFolderOpen className="w-5 h-5" />
        </ActivityButton>
      </div>

      {/* Middle scrollable group */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center space-y-6 py-4">
        <ActivityButton
          title="Search"
          active={activeView === "search"}
          onClick={() => changeView("search")}
        >
          <FaSearch className="w-5 h-5" />
        </ActivityButton>

        <ActivityButton
          title="Terminal"
          active={activeView === "terminal"}
          onClick={() => changeView("editor")} // Just focus on terminal in editor view
        >
          <FaTerminal className="w-5 h-5" />
        </ActivityButton>

        <ActivityButton
          title="Run & Debug"
          active={activeView === "debug"}
          onClick={() => changeView("debug")}
        >
          <FaPlay className="w-5 h-5" />
        </ActivityButton>

        <ActivityButton
          title="Settings"
          active={activeView === "settings"}
          onClick={openSettings}
        >
          <FaCog className="w-5 h-5" />
        </ActivityButton>
      </div>
    </div>
  );
}

function ActivityButton({ title, active = false, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`
        flex items-center justify-center
        w-10 h-10 p-1 rounded-lg
        transition-colors duration-150
        ${
          active
            ? "bg-gray-700 border-l-2 border-blue-400 text-white"
            : "text-gray-400 hover:bg-gray-700 hover:text-white"
        }
      `}
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}
