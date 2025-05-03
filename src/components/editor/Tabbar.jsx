import { useEffect, useRef } from "react";
import { FaPlay, FaSpinner } from "react-icons/fa";
// VS Code-style TabBar with authentic VS Code colors
export function TabBar({
  files = [],
  activePath,
  onSelect,
  onClose,
  onOpen,
  compileAndRun,
  isRunning,
  defaultSettings,
  activeFile,
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
    <div className="flex items-center justify-center mr-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 256 288"
        preserveAspectRatio="xMinYMin meet"
      >
        <path
          d="M255.569 84.72c-.002-4.83-1.035-9.098-3.124-12.761-2.052-3.602-5.125-6.621-9.247-9.008-34.025-19.619-68.083-39.178-102.097-58.817-9.17-5.294-18.061-5.101-27.163.269C100.395 12.39 32.59 51.237 12.385 62.94 4.064 67.757.015 75.129.013 84.711 0 124.166.013 163.62 0 203.076c.002 4.724.991 8.909 2.988 12.517 2.053 3.711 5.169 6.813 9.386 9.254 20.206 11.703 88.02 50.547 101.56 58.536 9.106 5.373 17.997 5.565 27.17.269 34.015-19.64 68.075-39.198 102.105-58.817 4.217-2.44 7.333-5.544 9.386-9.252 1.994-3.608 2.985-7.793 2.987-12.518 0 0 0-78.889-.013-118.345"
          fill="#5C8DBC"
        />
        <path
          d="M128.182 143.509L2.988 215.593c2.053 3.711 5.169 6.813 9.386 9.254 20.206 11.703 88.02 50.547 101.56 58.536 9.106 5.373 17.997 5.565 27.17.269 34.015-19.64 68.075-39.198 102.105-58.817 4.217-2.44 7.333-5.544 9.386-9.252l-124.413-72.074"
          fill="#1A4674"
        />
        <path
          d="M91.101 164.861c7.285 12.718 20.98 21.296 36.69 21.296 15.807 0 29.58-8.687 36.828-21.541l-36.437-21.107-37.081 21.352"
          fill="#1A4674"
        />
        <path
          d="M255.569 84.72c-.002-4.83-1.035-9.098-3.124-12.761l-124.263 71.55 124.413 72.074c1.994-3.608 2.985-7.793 2.987-12.518 0 0 0-78.889-.013-118.345"
          fill="#1B598E"
        />
        <path
          d="M248.728 148.661h-9.722v9.724h-9.724v-9.724h-9.721v-9.721h9.721v-9.722h9.724v9.722h9.722v9.721M213.253 148.661h-9.721v9.724h-9.722v-9.724h-9.722v-9.721h9.722v-9.722h9.722v9.722h9.721v9.721"
          fill="#FFF"
        />
        <path
          d="M164.619 164.616c-7.248 12.854-21.021 21.541-36.828 21.541-15.71 0-29.405-8.578-36.69-21.296a42.062 42.062 0 0 1-5.574-20.968c0-23.341 18.923-42.263 42.264-42.263 15.609 0 29.232 8.471 36.553 21.059l36.941-21.272c-14.683-25.346-42.096-42.398-73.494-42.398-46.876 0-84.875 38-84.875 84.874 0 15.378 4.091 29.799 11.241 42.238 14.646 25.48 42.137 42.637 73.634 42.637 31.555 0 59.089-17.226 73.714-42.781l-36.886-21.371"
          fill="#FFF"
        />
      </svg>
    </div>
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
      className="flex items-end border-b"
      style={{
        background: palette.editorBackground || vscodeBg,
        borderBottom: `1px solid ${palette.tabBorder || vscodeTabBorder}`,
      }}
    >
      <div className="flex-1 flex items-center overflow-x-auto">
        {displayFiles.map((file, idx) => {
          const isActive = activeFilePath === file.path;
          return (
            <div
              key={file.path}
              onClick={() => onSelect(file.path)}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              className="flex items-center px-4 h-8 cursor-pointer select-none relative group"
              style={{
                background: isActive
                  ? palette.editorBackground || vscodeActiveTabBg
                  : palette.editorBackground || vscodeBg,
                color: isActive
                  ? palette.editorForeground || vscodeActiveText
                  : palette.editorForeground || vscodeInactiveText,
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
                    ? palette.editorForeground || vscodeActiveText
                    : palette.editorForeground || vscodeInactiveText,
                }}
              >
                {file.name}
              </span>
              {file.isUnsaved && (
                <span
                  title="Unsaved Changes"
                  style={{
                    color: palette.editorForeground || vscodeDirtyIndicator,
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
        onClick={compileAndRun}
        disabled={isRunning || !activeFile}
        className={`p-2 rounded-full transition-colors duration-200 ${
          isRunning || !activeFile
            ? "text-gray-400 cursor-not-allowed"
            : "text-green-500 hover:bg-gray-300 hover:text-green-600"
        }`}
        title="Run"
        aria-label="Run"
      >
        {isRunning ? <FaSpinner className="animate-spin " /> : <FaPlay />}
      </button>
    </div>
  );
}
