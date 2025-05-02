import {
  X,
  Minus,
  Square,
  Maximize2,
  RefreshCcw,
  MonitorSmartphone,
  Wrench,
} from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEditor } from "../../context/EditorContext";
import { useState, useEffect, useRef } from "react";
import Keybindings from "../../utils/keybindings";
import logo from "../../assets/logo.png";

export default function MenuBar() {
  const { activeFileName, compileAndRun } = useEditor();
  const [fileMenuOpen, setFileMenuOpen] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // grab the window handle
  const appWindow = getCurrentWindow();

  const menuBarRef = useRef();

  const toggleMenu = (menuTitle) => {
    setFileMenuOpen((prev) => (prev === menuTitle ? null : menuTitle));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target)) {
        setFileMenuOpen(null);
      }
    };
    if (fileMenuOpen) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [fileMenuOpen]);

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
    <div
      ref={menuBarRef}
      className="select-none flex items-center justify-between h-10 bg-[#22232a] border-b border-[#181920] px-2 relative"
      style={{
        boxShadow: "0 1px 0 0 #141416, 0 1.5px 0 0 #23232a",
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        letterSpacing: "0.01em",
      }}
      data-tauri-drag-region
    >
      {/* Left: Logo & Menus */}
      <div className="flex items-center" data-no-drag>
        <div className="flex items-center" data-no-drag>
          <div
            onMouseDown={() => appWindow.startDragging()}
            className="flex items-center px-3"
            data-no-drag
          >
            <img src={logo} alt="Cpitor Logo" className="w-5 h-5 mr-2" />
            <p>Cpitor Beta</p>
          </div>
        </div>
        <div className="flex space-x-1 px-1" data-no-drag>
          {Object.entries(Keybindings).map(([title, submenu]) => (
            <div key={title} className="relative">
              <button
                onClick={() => toggleMenu(title)}
                className={`
                  px-3 py-0.5 
                  text-xs 
                  rounded-t-md
                  transition-colors
                  ${
                    fileMenuOpen === title
                      ? "bg-[#282a36] text-[#4fc3f7] shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-[#23232a]"
                  }
                  font-semibold
                `}
                style={{
                  outline: "none",
                  border: "none",
                }}
              >
                {title}
              </button>
              {fileMenuOpen === title && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#23232a] border border-[#31313a] rounded-b-md shadow-lg z-50 animate-fade-in">
                  {submenu.map((item, i) => (
                    <button
                      key={i}
                      disabled={!activeFileName && item.label === "Run Code"}
                      onClick={() => {
                        setFileMenuOpen(null);
                        if (item.onClick) item.onClick();
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-sm
                        transition-colors
                        ${
                          !activeFileName && item.label === "Run Code"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#30303b] hover:text-[#4fc3f7]"
                        }
                        ${i === 0 ? "rounded-t" : ""}
                        ${i === submenu.length - 1 ? "rounded-b" : ""}
                        bg-transparent text-gray-200
                      `}
                    >
                      <span>{item.label}</span>
                      <span className="float-right text-xs text-gray-500">
                        {item.shortcut}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-[#2d2d34] my-1" />
                  <button
                    onClick={() => {
                      setFileMenuOpen(null);
                      appWindow.reload();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-[#30303b] hover:text-[#4fc3f7] transition-colors"
                  >
                    <RefreshCcw size={15} /> Reload
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
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
