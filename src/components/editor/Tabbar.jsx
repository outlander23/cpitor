import { useEffect, useRef } from "react";

// VS Code-style TabBar with authentic VS Code colors
export function TabBar({
  files = [],
  activePath,
  onSelect,
  onClose,
  onOpen,
  defaultSettings,
}) {
  const theme = defaultSettings.theme;
  const palette = defaultSettings.themeColors[theme];
  const tabBarRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Tab") {
        if (!files.length) return;
        e.preventDefault();
        const idx = files.findIndex((f) => f.path === activePath);
        const nextIdx = e.shiftKey
          ? (idx - 1 + files.length) % files.length
          : (idx + 1) % files.length;
        onSelect(files[nextIdx].path);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [files, activePath, onSelect]);

  // Fallback for demo
  const defaultFiles = [
    { path: "TitleBar.jsx", name: "TitleBar.jsx", isUnsaved: true },
    { path: "App.jsx", name: "App.jsx", isUnsaved: false },
    { path: "CodeEditor.jsx", name: "CodeEditor.jsx", isUnsaved: true },
  ];
  const displayFiles = files.length ? files : defaultFiles;
  const activeFilePath = activePath || displayFiles[0]?.path || "";

  // VS Code-style React icon (for demo, you can use file type icons if you want)
  const getFileIcon = () => (
    <svg
      viewBox="0 0 40 40"
      width={16}
      height={16}
      className="mr-2"
      style={{ display: "inline" }}
    >
      <g>
        <ellipse
          fill="none"
          stroke="#61dafb"
          strokeWidth="2.3"
          cx="20"
          cy="20"
          rx="16"
          ry="7"
        />
        <ellipse
          fill="none"
          stroke="#61dafb"
          strokeWidth="2.3"
          cx="20"
          cy="20"
          rx="7"
          ry="16"
          transform="rotate(60 20 20)"
        />
        <ellipse
          fill="none"
          stroke="#61dafb"
          strokeWidth="2.3"
          cx="20"
          cy="20"
          rx="7"
          ry="16"
          transform="rotate(120 20 20)"
        />
        <circle fill="#61dafb" cx="20" cy="20" r="3" />
      </g>
    </svg>
  );

  // Authentic VS Code colors
  const vscodeBg = "#1e1e1e"; // VS Code background
  const vscodeActiveTabBg = "#252526"; // VS Code active tab background
  const vscodeTabBorder = "#252526"; // VS Code tab border
  const vscodeActiveTabBorder = "#007fd4"; // VS Code blue underline
  const vscodeActiveText = "#ffffff"; // VS Code active tab text
  const vscodeInactiveText = "#969696"; // VS Code inactive tab text
  const vscodeDirtyIndicator = "#cc6633"; // VS Code dirty indicator color

  return (
    <div
      ref={tabBarRef}
      className="flex items-end h-9 border-b"
      style={{
        background: palette.tabBackground || vscodeBg,
        borderBottom: `1px solid ${palette.tabBorder || vscodeTabBorder}`,
      }}
    >
      <div className="flex-1 flex items-end overflow-x-auto">
        {displayFiles.map((file, idx) => {
          const isActive = activeFilePath === file.path;
          return (
            <div
              key={file.path}
              onClick={() => onSelect(file.path)}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              className="flex items-center px-4 h-9 cursor-pointer select-none relative group"
              style={{
                background: isActive
                  ? palette.tabActiveBackground || vscodeActiveTabBg
                  : palette.tabBackground || vscodeBg,
                color: isActive
                  ? palette.tabActiveText || vscodeActiveText
                  : palette.tabText || vscodeInactiveText,
                borderRight:
                  idx !== displayFiles.length - 1
                    ? `1px solid ${palette.tabBorder || vscodeTabBorder}`
                    : "none",
                borderBottom: isActive
                  ? `2px solid ${
                      palette.tabActiveBorder || vscodeActiveTabBorder
                    }`
                  : "2px solid transparent",
                marginBottom: isActive ? "-1px" : "0",
                fontWeight: isActive ? 400 : 400, // VS Code doesn't bold active tabs
                minWidth: 0,
                maxWidth: 240,
                fontSize: 13, // VS Code uses a slightly smaller font
                transition: "background 0.1s, color 0.1s",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(file.path);
                }
              }}
            >
              {getFileIcon()}
              <span
                className="mr-2 truncate"
                style={{
                  color: isActive
                    ? palette.tabActiveText || vscodeActiveText
                    : palette.tabText || vscodeInactiveText,
                }}
              >
                {file.name}
              </span>
              {file.isUnsaved && (
                <span
                  title="Unsaved Changes"
                  style={{
                    color: palette.tabDirty || vscodeDirtyIndicator,
                    fontSize: 18,
                    lineHeight: "18px",
                    marginTop: "-2px",
                    marginLeft: 2,
                    marginRight: 2,
                  }}
                >
                  •
                </span>
              )}
              {(isActive || true) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(file.path);
                  }}
                  className={`ml-2 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-70"
                  } hover:opacity-100 hover:bg-[#333333] rounded-sm transition-opacity`}
                  style={{
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={`Close ${file.name}`}
                  tabIndex={-1}
                >
                  <svg
                    viewBox="0 0 16 16"
                    width={12}
                    height={12}
                    stroke="#cccccc"
                    strokeWidth={1.5}
                  >
                    <line x1="4" y1="4" x2="12" y2="12" />
                    <line x1="12" y1="4" x2="4" y2="12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={onOpen}
        className="px-3 py-1.5 flex-shrink-0 hover:bg-[#2a2d2e] rounded ml-1"
        style={{
          color: "#cccccc",
          marginBottom: 2,
        }}
        title="Open File"
        aria-label="Open File"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
