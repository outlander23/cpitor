import { useEffect, useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { homeDir, resolve } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/plugin-fs";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
} from "lucide-react";
import { SiCplusplus, SiC } from "react-icons/si";

export const FONT_SIZE = 14;
export const LINE_HEIGHT = 1.6;

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
  const { showFileExplorer, openFile, isDirOpen, openDirPath } = useEditor();

  useEffect(() => {
    async function init() {
      try {
        const home = openDirPath || (await homeDir());
        setRootPath(home);
        await loadDirectory(home);
        setExpandedPaths(new Set([home]));
      } catch (e) {
        setError("Failed to initialize: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [isDirOpen]);

  async function loadDirectory(dirPath) {
    try {
      const contents = await readDir(dirPath);
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

  async function handleToggleDirectory(path, expanded) {
    try {
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
            className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer rounded-md hover:bg-zinc-700 transition-colors`}
            style={{ paddingLeft: depth * 16 }}
            onClick={() => {
              if (item.isDir) {
                handleToggleDirectory(fullPath, isOpen);
              } else if (isCppFile) {
                openFile(fullPath, item.name);
              }
            }}
          >
            <span className="w-4">
              {item.isDir ? (
                isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )
              ) : (
                <span />
              )}
            </span>
            {item.isDir ? (
              <>
                {isOpen ? (
                  <FolderOpen className="text-yellow-400" size={16} />
                ) : (
                  <Folder className="text-yellow-400" size={16} />
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

  if (!showFileExplorer || !isDirOpen) return null;

  return (
    <div
      className="bg-zinc-900 text-gray-200 w-full max-w-sm border-r border-zinc-800"
      style={{
        fontSize: `${FONT_SIZE}px`,
        lineHeight: LINE_HEIGHT,
      }}
    >
      <div className="p-4 border-b border-zinc-800 bg-zinc-950 text-xs font-semibold tracking-wider text-gray-300 uppercase">
        Explorer
      </div>

      <div
        className="flex-1 overflow-y-auto custom-scrollbar px-1 py-2"
        style={{ height: "100vh" }}
      >
        {loading ? (
          <div className="text-gray-500 px-3 py-2">Loading…</div>
        ) : error ? (
          <div className="text-red-500 px-3 py-2">{error}</div>
        ) : (
          <>
            <div
              className="flex items-center gap-1 px-3 py-2 cursor-pointer font-medium hover:bg-zinc-700 rounded-md transition-colors"
              onClick={() =>
                handleToggleDirectory(rootPath, expandedPaths.has(rootPath))
              }
            >
              <span className="w-4">
                {expandedPaths.has(rootPath) ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
              <FolderOpen size={16} className="text-yellow-400" />
              <span className="ml-1 font-semibold">
                {rootPath.split(/[\\/]/).filter(Boolean).pop()}
              </span>
            </div>
            {expandedPaths.has(rootPath) && renderFileTree(rootPath)}
          </>
        )}
      </div>
    </div>
  );
}

export default FileBrowser;
