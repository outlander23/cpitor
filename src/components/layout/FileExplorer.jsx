import { useEffect, useState, useRef } from "react";
import { useEditor } from "../../context/EditorContext";
import appPalette from "./palette";
import { homeDir, resolve } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/plugin-fs";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Plus,
  FolderPlus,
} from "lucide-react";
import { SiCplusplus, SiC } from "react-icons/si";

export const FONT_SIZE = 12;
export const LINE_HEIGHT = 1.2;

function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  switch (ext) {
    case "cpp":
    case "h":
    case "hpp":
      return <SiCplusplus className="text-blue-500" size={16} />;
    case "c":
      return <SiC className="text-blue-400" size={16} />;
    default:
      return <File className="text-gray-400" size={16} />;
  }
}

function FileBrowser() {
  const [fileTree, setFileTree] = useState({});
  const [expandedPaths, setExpandedPaths] = useState(new Set());
  const [rootPath, setRootPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    dir: null,
  });
  const menuRef = useRef(null);
  const {
    showFileExplorer,
    openFile,
    isDirOpen,
    openDirPath,
    settings,
    setActiveDirectory,
    activeDirectory,
    addNewFileFromExplorer,
    addNewFileInDirectory,
    currentOpenDir,
    activeView,
    changeView,
    theme,
  } = useEditor();

  // prefer themeColors from settings if present, otherwise use centralized palette
  const palette =
    (settings && settings.themeColors && settings.themeColors[theme]) ||
    appPalette[theme || "dark"];

  // reload directory helper (keeps fileTree in sync)
  async function reloadDirectory(dir) {
    try {
      const dirToLoad = dir || activeDirectory || openDirPath || rootPath;
      if (!dirToLoad) return;
      await loadDirectory(dirToLoad);
      setExpandedPaths((prev) => new Set([...Array.from(prev), dirToLoad]));
    } catch (e) {
      setError("Failed to reload directory: " + (e?.message || e));
    }
  }

  const createFile = async () => {
    try {
      // await the creation flow in context so we can reload directory afterwards
      await addNewFileFromExplorer();

      // reload the directory that should contain the new file
      await reloadDirectory(activeDirectory || openDirPath || rootPath);
    } catch (e) {
      setError("Failed to create file: " + (e?.message || e));
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const home = openDirPath || (await homeDir());
        setRootPath(home);
        await loadDirectory(home);
        setExpandedPaths(new Set([home]));
      } catch (e) {
        setError("Failed to initialize: " + (e?.message || e));
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [isDirOpen, currentOpenDir]);

  async function loadDirectory(dirPath) {
    try {
      const contents = await readDir(dirPath);
      setActiveDirectory(dirPath);
      const sorted = contents.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      const visible = sorted.filter((item) => !item.name.startsWith("."));
      const processed = await Promise.all(
        visible.map(async (item) => ({
          name: item.name,
          path: await resolve(dirPath, item.name),
          isDir: item.isDirectory,
        }))
      );
      setFileTree((prev) => ({ ...prev, [dirPath]: processed }));
      return processed;
    } catch (e) {
      setError(`Failed to read directory: ${e.message}`);
      return [];
    }
  }

  // console.log("activeDirectory", activeDirectory);
  async function handleToggleDirectory(path, expanded) {
    try {
      setActiveDirectory(path);
      const next = new Set(expandedPaths);
      if (expanded) next.delete(path);
      else {
        next.add(path);
        if (!fileTree[path]) await loadDirectory(path);
      }
      setExpandedPaths(next);
    } catch (e) {
      setError("Failed to toggle directory: " + e.message);
    }
  }

  // click outside to close context menu
  useEffect(() => {
    function onDocClick(e) {
      if (!contextMenu.visible) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu((m) => ({ ...m, visible: false }));
      }
    }
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, [contextMenu.visible]);

  // show context menu on directory right-click
  async function onDirectoryContextMenu(e, dirPath) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      dir: dirPath,
    });
  }

  async function handleContextNewFile() {
    const dir = contextMenu.dir || activeDirectory || openDirPath || rootPath;
    setContextMenu((m) => ({ ...m, visible: false }));
    if (!dir) return;
    // use the context helper to create file in the chosen dir
    const created = await addNewFileInDirectory(dir);
    // reload that directory so new file appears
    await reloadDirectory(dir);
    if (created) {
      // optionally expand and open the file automatically
      setExpandedPaths((prev) => new Set([...Array.from(prev), dir]));
    }
  }

  // modify the directory row to attach onContextMenu
  // ...in renderFileTree replace directory's wrapper onClick logic with:
  // onContextMenu={(e) => onDirectoryContextMenu(e, fullPath)}
  // keep click behavior intact for toggling

  function renderFileTree(dirPath, depth = 1) {
    const items = fileTree[dirPath] || [];
    return items.map((item) => {
      const fullPath = item.path;
      const isOpen = expandedPaths.has(fullPath);
      const isCppFile = !item.isDir && /\.(cpp|c|h|hpp)$/i.test(item.name);
      if (!item.isDir && !isCppFile) return null;

      return (
        <div key={`${fullPath}-${item.name}`}>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer rounded-md transition-colors ${
              settings.theme === "light"
                ? "hover:bg-gray-200 text-gray-800"
                : "hover:bg-gray-700 text-gray-100"
            }`}
            style={{ paddingLeft: depth * 16 }}
            onClick={() => {
              if (item.isDir) {
                handleToggleDirectory(fullPath, isOpen);
              } else if (isCppFile) {
                openFile(fullPath, item.name);
                if (activeView !== "editor") {
                  changeView("editor");
                }
              }
            }}
            onContextMenu={(e) => {
              if (item.isDir) onDirectoryContextMenu(e, fullPath);
            }}
          >
            <span className="w-4">
              {item.isDir ? (
                isOpen ? (
                  <ChevronDown size={14} style={{ color: "#D4D4D4" }} />
                ) : (
                  <ChevronRight size={14} style={{ color: "#D4D4D4" }} />
                )
              ) : (
                <span />
              )}
            </span>
            {item.isDir ? (
              <>
                {isOpen ? (
                  <FolderOpen style={{ color: "#90A4AE" }} size={16} />
                ) : (
                  <Folder style={{ color: "#90A4AE" }} size={16} />
                )}
                <span className="truncate text-sm">{item.name}</span>
              </>
            ) : (
              <>
                {getFileIcon(item.name)}
                <span className="truncate text-sm">{item.name}</span>
              </>
            )}
          </div>

          {item.isDir && isOpen && renderFileTree(fullPath, depth + 1)}
        </div>
      );
    });
  }

  // render context menu element
  const menuStyle = {
    position: "fixed",
    left: contextMenu.x,
    top: contextMenu.y,
    zIndex: 9999,
    background: settings.theme === "light" ? "#fff" : "#1f2937",
    color: settings.theme === "light" ? "#111827" : "#E5E7EB",
    border: `1px solid ${palette.border}`,
    borderRadius: 6,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    minWidth: 160,
  };

  if (!showFileExplorer || !isDirOpen) return null;

  return (
    <>
      <div
        className="w-full max-w-sm h-full flex flex-col border-r"
        style={{
          fontSize: `${FONT_SIZE}px`,
          lineHeight: LINE_HEIGHT,
          backgroundColor: palette.sidebarBackground,
          color: palette.sidebarForeground,
          borderRight: `1px solid ${palette.border}`,
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{
            borderBottom: `1px solid ${palette.border}`,
            backgroundColor: palette.headerBackground,
            color: palette.headerForeground,
          }}
        >
          <span className="text-xs font-bold uppercase tracking-wider">
            Explorer
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-white-400  cursor-pointer "
              title="New File"
              onClick={createFile}
            >
              <Plus size={16} />
            </button>
            {/* <button
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-white-400 courser-pointer"
            title="New Folder"
          >
            <FolderPlus size={16} />
          </button> */}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-1 py-2">
          {loading ? (
            <div className="text-gray-500 px-3 py-2">Loading…</div>
          ) : error ? (
            <div className="text-red-500 px-3 py-2">{error}</div>
          ) : (
            <>
              <div
                className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer rounded-md transition-colors ${
                  settings.theme === "light"
                    ? "hover:bg-gray-200 text-gray-800"
                    : "hover:bg-gray-700 text-gray-100"
                }`}
                onClick={() =>
                  handleToggleDirectory(rootPath, expandedPaths.has(rootPath))
                }
              >
                <span className="w-4">
                  {expandedPaths.has(rootPath) ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                </span>
                <FolderOpen size={16} className="text-blue-800" />
                <span className="ml-1 font-semibold">
                  {rootPath.split(/[\\/]/).filter(Boolean).pop()}
                </span>
              </div>
              {expandedPaths.has(rootPath) && renderFileTree(rootPath)}
            </>
          )}
        </div>
      </div>

      {contextMenu.visible && (
        <div ref={menuRef} style={menuStyle}>
          <div
            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            onClick={handleContextNewFile}
          >
            New File
          </div>
        </div>
      )}
    </>
  );
}

export default FileBrowser;
