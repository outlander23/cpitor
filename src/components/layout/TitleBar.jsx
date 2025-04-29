import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEditor } from "../../context/EditorContext";
import { useState, useRef, useEffect } from "react";

import Keybindings from "../../utils/keybindings";

export default function TitleBar() {
  const { activeFileName, handleMenuAction, compileAndRun } = useEditor();
  const [fileMenuOpen, setFileMenuOpen] = useState(null); // Track only one open menu at a time
  const isDragging = useRef(false);

  const handleMouseDown = async () => {
    try {
      await getCurrentWindow().startDragging();
    } catch (error) {}
  };

  const handleMouseEnterMenu = (menuTitle) => {
    setFileMenuOpen(menuTitle);
  };

  const handleMouseLeaveMenu = () => {
    setFileMenuOpen(null);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "F7" || e.keyCode === 118) {
        e.preventDefault();
        compileAndRun();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [compileAndRun]);

  const menuItems = Keybindings;

  return (
    <div
      className="bg-gray-800 h-10 flex items-center justify-between text-sm text-gray-200 select-none"
      onMouseDown={handleMouseDown}
    >
      <div className="flex space-x-2 pl-4" data-no-drag="true">
        {Object.entries(menuItems).map(([menuTitle, submenu]) => (
          <div
            key={menuTitle}
            className="relative"
            onMouseEnter={() => handleMouseEnterMenu(menuTitle)}
            onMouseLeave={handleMouseLeaveMenu}
          >
            <span
              className={`px-2 py-1 rounded cursor-default transition-colors ${
                fileMenuOpen === menuTitle ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              data-no-drag="true"
            >
              {menuTitle}
            </span>

            {fileMenuOpen === menuTitle && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                {submenu.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleMenuAction(item.label)}
                    className={`flex justify-between px-3 py-1.5 text-sm cursor-pointer ${
                      !activeFileName && item.label === "Run Code"
                        ? "opacity-50 cursor-not-allowed" // Disable the button if no active file
                        : "hover:bg-gray-700"
                    }`}
                    data-no-drag="true"
                  >
                    <span>{item.label}</span>
                    <span className="text-gray-400 text-xs">
                      {item.shortcut}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-1 pr-2" data-no-drag="true">
        <button
          onClick={() => handleMenuAction("Minimize")}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded"
          aria-label="Minimize window"
        >
          <span className="text-gray-400 hover:text-white">−</span>
        </button>
        <button
          onClick={() => handleMenuAction("Toggle Full Screen")}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded"
          aria-label="Maximize/Restore window"
        >
          <span className="text-gray-400 hover:text-white">□</span>
        </button>
        <button
          onClick={() => handleMenuAction("Exit")}
          className="w-8 h-8 flex items-center justify-center hover:bg-red-500 rounded"
          aria-label="Close window"
        >
          <span className="text-gray-400 hover:text-white">×</span>
        </button>
      </div>
    </div>
  );
}
