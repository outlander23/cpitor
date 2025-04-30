import {
  X,
  Minus,
  Square,
  Maximize2,
  Search,
  RefreshCcw,
  MonitorSmartphone,
  Wrench,
} from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEditor } from "../../context/EditorContext";
import { useState, useEffect } from "react";
import Keybindings from "../../utils/keybindings";
import logo from "../../assets/logo.png";

export default function TitleBar() {
  const { activeFileName, compileAndRun } = useEditor();
  const [fileMenuOpen, setFileMenuOpen] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // grab the window handle
  const appWindow = getCurrentWindow();

  const toggleMenu = (menuTitle) => {
    setFileMenuOpen((prev) => (prev === menuTitle ? null : menuTitle));
  };

  useEffect(() => {
    // keyboard shortcuts
    const onKeyDown = (e) => {
      switch (e.key) {
        case "F7":
          e.preventDefault();
          compileAndRun();
          break;
        case "F5":
          e.preventDefault();
          appWindow.reload();
          break;
        case "F11":
          e.preventDefault();
          appWindow.toggleFullscreen();
          break;
        default:
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // track maximize/restore
    let unlisten;
    const updateMax = async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    };
    appWindow.listen("tauri://resize", updateMax).then((fn) => {
      unlisten = fn;
    });
    updateMax();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (typeof unlisten === "function") unlisten();
    };
  }, [compileAndRun, appWindow]);

  return (
    <div className="select-none flex items-center justify-between h-10 bg-[#252526] border-b border-[#1e1e1e]">
      {/* Left: Logo & Menus */}
      <div className="flex items-center" data-no-drag>
        <div
          onMouseDown={() => appWindow.startDragging()}
          className="flex items-center px-3"
          data-no-drag
        >
          <img src={logo} alt="Cpitor Logo" className="w-5 h-5 mr-2" />
          <p>Cpitor Beta</p>
        </div>
        <div className="flex space-x-2 px-2" data-no-drag>
          {Object.entries(Keybindings).map(([title, submenu]) => (
            <div key={title} className="relative">
              <button
                onClick={() => toggleMenu(title)}
                className="px-2 py-1 text-xs text-gray-400 hover:text-white"
              >
                {title}
              </button>
              {fileMenuOpen === title && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-[#252526] border border-[#1e1e1e] rounded shadow-lg z-50">
                  {submenu.map((item, i) => (
                    <button
                      key={i}
                      disabled={!activeFileName && item.label === "Run Code"}
                      onClick={() => setFileMenuOpen(null)}
                      className={`w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-[#37373d] ${
                        !activeFileName && item.label === "Run Code"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="float-right text-xs text-gray-500">
                        {item.shortcut}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-[#3c3c3c] my-1" />
                  <button
                    onClick={() => appWindow.reload()}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-[#37373d]"
                  >
                    <RefreshCcw size={14} /> Reload
                  </button>
                  <button
                    onClick={() => appWindow.toggleFullscreen()}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-[#37373d]"
                  >
                    <MonitorSmartphone size={14} /> Toggle Fullscreen
                  </button>
                  <button
                    onClick={() => appWindow.openDevTools()}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-[#37373d]"
                  >
                    <Wrench size={14} /> DevTools
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Draggable Blank Area (between left and search) */}
      <div
        className="flex-1 bg-amber-100 w-full"
        onMouseDown={() => appWindow.startDragging()}
        data-no-drag={false}
      />

      {/* Center: Search (non-draggable) */}
      <div className="flex justify-center max-w-md" data-no-drag>
        <div className="relative w-full mx-4">
          <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search Cpitor"
            className="w-full h-7 rounded-md pl-8 pr-2 text-sm bg-[#3c3c3c] text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Draggable Blank Area (between search and controls) */}
      <div
        className="flex-1 bg-amber-300 w-full"
        onMouseDown={() => appWindow.startDragging()}
        data-no-drag={false}
      />

      {/* Right: Window Controls */}
      <div className="flex" data-no-drag>
        <button
          onClick={() => appWindow.minimize()}
          className="p-2 text-gray-400 hover:bg-[#333333] hover:text-white"
          aria-label="Minimize window"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={async () => {
            const maximized = await appWindow.isMaximized();
            if (maximized) {
              await appWindow.unmaximize();
            } else {
              await appWindow.maximize();
            }
            setIsMaximized(!maximized);
          }}
          className="p-2 text-gray-400 hover:bg-[#333333] hover:text-white"
          aria-label="Maximize/Restore window"
        >
          {isMaximized ? (
            <Square className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => appWindow.close()}
          className="p-2 text-gray-400 hover:bg-[#e81123] hover:text-white"
          aria-label="Close window"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
