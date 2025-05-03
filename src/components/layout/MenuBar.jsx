import { X, Minus, Square, Maximize2, RefreshCcw } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEditor } from "../../context/EditorContext";
import { useState, useEffect, useRef } from "react";
import Keybindings from "../../utils/keybindings";
import logo from "../../assets/logo.png";

export default function MenuBar() {
  const {
    activeFileName,
    compileAndRun,
    handleMenuAction,
    theme,
    handleFullscreen,
  } = useEditor();
  const [fileMenuOpen, setFileMenuOpen] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const appWindow = getCurrentWindow();
  const menuBarRef = useRef();

  // Theme-based colors
  const isDark = theme === "dark";
  const textColor = isDark ? "text-gray-200" : "text-[#22232a]";
  const hoverTextColor = isDark ? "hover:text-white" : "hover:text-[#1e1e1e]";
  const hoverBg = isDark ? "hover:bg-[#23232a]" : "hover:bg-[#f3f3f3]";
  const menuBg = isDark ? "bg-[#23232a]" : "bg-white";
  const menuBorder = isDark ? "border-[#31313a]" : "border-[#e5e5e5]";
  const menuShadow = isDark ? "shadow-lg" : "shadow";
  const activeMenuBg = isDark ? "bg-[#282a36]" : "bg-[#e5f2fb]";
  const activeMenuText = isDark ? "text-[#4fc3f7]" : "text-[#1e7fc7]";
  const barBg = isDark ? "bg-[#22232a]" : "bg-[#f5f5f7]";
  const barBorder = isDark ? "border-[#181920]" : "border-[#e5e5e5]";
  const menuItemHoverBg = isDark ? "hover:bg-[#30303b]" : "hover:bg-[#eaf6ff]";
  const menuItemHoverText = isDark
    ? "hover:text-[#4fc3f7]"
    : "hover:text-[#1e7fc7]";
  const menuDivider = isDark ? "border-[#2d2d34]" : "border-[#e5e5e5]";

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
          handleFullscreen();
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
  }, [compileAndRun, appWindow, handleFullscreen]);

  return (
    <div
      ref={menuBarRef}
      className={`select-none flex items-center justify-between h-10 ${barBg} border-b ${barBorder} px-2 relative`}
      style={{
        boxShadow: isDark
          ? "0 1px 0 0 #141416, 0 1.5px 0 0 #23232a"
          : "0 1px 0 0 #ececec, 0 1.5px 0 0 #e5e5e5",
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
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
            <p className={`${textColor}`}>Cpitor Beta</p>
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
                      ? `${activeMenuBg} ${activeMenuText} shadow-sm`
                      : `${textColor} ${hoverTextColor} ${hoverBg}`
                  }
                `}
                style={{
                  outline: "none",
                  border: "none",
                  fontWeight: 400,
                }}
              >
                {title}
              </button>
              {fileMenuOpen === title && (
                <div
                  className={`absolute top-full left-0 mt-1 w-56 ${menuBg} border ${menuBorder} rounded-b-md ${menuShadow} z-50`}
                >
                  {submenu.map((item, i) => {
                    const isDisabled =
                      (item.label === "Run Code" && !activeFileName) || false;
                    return (
                      <button
                        key={i}
                        disabled={isDisabled}
                        onClick={() => {
                          setFileMenuOpen(null);
                          handleMenuAction(item.label);
                        }}
                        className={`
                          w-full text-left px-4 py-2 text-sm
                          transition-colors
                          ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : `${menuItemHoverBg} ${menuItemHoverText}`
                          }
                          ${i === 0 ? "rounded-t" : ""}
                          ${i === submenu.length - 1 ? "rounded-b" : ""}
                          bg-transparent ${textColor}
                        `}
                        style={{ fontWeight: 400 }}
                      >
                        <span>{item.label}</span>
                        <span className="float-right text-xs text-gray-500">
                          {item.shortcut}
                        </span>
                      </button>
                    );
                  })}
                  <div className={`border-t my-1 ${menuDivider}`} />
                  <button
                    onClick={() => {
                      setFileMenuOpen(null);
                      appWindow.reload();
                    }}
                    className={
                      `w-full flex items-center gap-2 px-4 py-2 text-sm ${textColor} ` +
                      `${menuItemHoverBg} ${menuItemHoverText} transition-colors`
                    }
                    style={{ fontWeight: 400 }}
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
          className={`p-2 ${textColor} hover:bg-[#333333] hover:text-white`}
          aria-label="Minimize window"
          style={{ fontWeight: 400 }}
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
          className={`p-2 ${textColor} hover:bg-[#333333] hover:text-white`}
          aria-label="Maximize/Restore window"
          style={{ fontWeight: 400 }}
        >
          {isMaximized ? (
            <Square className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => appWindow.close()}
          className={`p-2 ${textColor} hover:bg-[#e81123] hover:text-white`}
          aria-label="Close window"
          style={{ fontWeight: 400 }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
