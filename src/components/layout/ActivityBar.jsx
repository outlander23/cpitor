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
  const { showFileExplorer, toggleFileExplorer } = useEditor();

  // Placeholder handlers
  const goHome = () => console.log("Navigate to Home");
  const openSettings = () => console.log("Open Settings");

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
        <ActivityButton title="Home" onClick={goHome}>
          <FaHome className="w-5 h-5" />
        </ActivityButton>

        <ActivityButton
          title="Explorer"
          active={showFileExplorer}
          onClick={toggleFileExplorer}
        >
          <FaFolderOpen className="w-5 h-5" />
        </ActivityButton>
      </div>

      {/* Middle scrollable group */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center space-y-6 py-4">
        <ActivityButton title="Search">
          <FaSearch className="w-5 h-5" />
        </ActivityButton>
        <ActivityButton title="Terminal">
          <FaTerminal className="w-5 h-5" />
        </ActivityButton>
        <ActivityButton title="Run & Debug">
          <FaPlay className="w-5 h-5" />
        </ActivityButton>{" "}
        <ActivityButton title="Settings" onClick={openSettings}>
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
