import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEditor } from "../../context/EditorContext";
import { useState, useRef } from "react";

export default function TitleBar() {
  const { activeFileName } = useEditor();
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const isDragging = useRef(false);

  const handleMouseDown = async () => {
    try {
      await getCurrentWindow().startDragging();
    } catch (error) {
      console.error("Failed to start dragging:", error);
    }
  };

  return (
    <div
      className="bg-gray-800 h-10 flex items-center justify-between text-sm text-gray-200 select-none"
      onMouseDown={handleMouseDown}
    >
      {/* Left Menu Section - Non-draggable */}
      <div className="flex space-x-4 pl-4" data-no-drag="true">
        {/* File Menu */}
        <div
          className="relative"
          onMouseEnter={() => setFileMenuOpen(true)}
          onMouseLeave={() => setFileMenuOpen(false)}
        >
          {/* Other Menu Items */}
          {["File", "Edit", "View", "Go", "Run", "Terminal", "Help"].map(
            (item) => (
              <span
                key={item}
                className="px-2 py-1 hover:bg-gray-700 rounded cursor-default transition-colors"
                data-no-drag="true"
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* Window Controls - Non-draggable */}
      <div className="flex space-x-1 pr-2" data-no-drag="true">
        <button
          onClick={() => getCurrentWindow().minimize()}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
          aria-label="Minimize window"
          data-no-drag="true"
        >
          <span className="text-gray-400 hover:text-white">−</span>
        </button>
        <button
          onClick={() => getCurrentWindow().toggleMaximize()}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
          aria-label="Maximize/Restore window"
          data-no-drag="true"
        >
          <span className="text-gray-400 hover:text-white">□</span>
        </button>
        <button
          onClick={() => getCurrentWindow().close()}
          className="w-8 h-8 flex items-center justify-center hover:bg-red-500 rounded transition-colors"
          aria-label="Close window"
          data-no-drag="true"
        >
          <span className="text-gray-400 hover:text-white">×</span>
        </button>
      </div>
    </div>
  );
}
