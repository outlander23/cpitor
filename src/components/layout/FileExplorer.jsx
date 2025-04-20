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

export const FONT_SIZE = 12;
export const LINE_HEIGHT = 1.5;

function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  switch (ext) {
    case "cpp":
    case "h":
    case "hpp":
      return <SiCplusplus className="text-blue-600" size={FONT_SIZE} />;
    case "c":
      return <SiC className="text-blue-600" size={FONT_SIZE} />;
    default:
      return <File className="text-gray-300" size={FONT_SIZE} />;
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

  function renderFileTree(dirPath, depth = 0) {
    const items = fileTree[dirPath] || [];

    return items.map((item) => {
      const fullPath = item.path;
      const isOpen = expandedPaths.has(fullPath);
      const ext = item.name.split(".").pop().toLowerCase();
      const isCppFile = !item.isDir && /\.(cpp|h|c)$/i.test(item.name);

      // ❌ Skip rendering completely if it's a non-`.cpp` file
      if (!item.isDir && !isCppFile) return null;

      return (
        <div key={`${fullPath}-${item.name}`}>
          <div
            className="flex items-center py-1 px-2 hover:bg-zinc-700 rounded cursor-pointer"
            style={{ paddingLeft: depth * 16 + 4 }}
            onClick={() => {
              if (item.isDir) {
                handleToggleDirectory(fullPath, isOpen);
              } else if (isCppFile) {
                openFile(fullPath, item.name);
              }
            }}
          >
            {item.isDir ? (
              <div className="flex items-center gap-1 text-blue-400">
                <span className="w-4">
                  {isOpen ? (
                    <ChevronDown size={FONT_SIZE} />
                  ) : (
                    <ChevronRight size={FONT_SIZE} />
                  )}
                </span>
                {isOpen ? (
                  <FolderOpen size={FONT_SIZE} />
                ) : (
                  <Folder size={FONT_SIZE} />
                )}
                <span className="ml-1 truncate">{item.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="w-4" />
                {getFileIcon(item.name)}
                <span className="ml-1 truncate">{item.name}</span>
              </div>
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
      className="bg-zinc-900 text-gray-200 w-full max-w-md h-screen flex flex-col"
      style={{
        fontSize: `${FONT_SIZE}px`,
        lineHeight: LINE_HEIGHT,
        overflow: "hidden",
      }}
    >
      <div className="p-3 border-b border-zinc-700">
        <h2 className="uppercase tracking-wider">EXPLORER</h2>
      </div>

      {/* Only this section is scrollable now */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{ height: "100vh", paddingRight: "2px" }}
      >
        {loading ? (
          <div className="text-gray-500 p-2">Loading…</div>
        ) : error ? (
          <div className="text-red-500 p-2">{error}</div>
        ) : (
          <>
            <div
              className="flex items-center py-1 px-2 hover:bg-zinc-700 rounded cursor-pointer"
              onClick={() =>
                handleToggleDirectory(rootPath, expandedPaths.has(rootPath))
              }
            >
              <span className="w-4">
                {expandedPaths.has(rootPath) ? (
                  <ChevronDown size={FONT_SIZE} />
                ) : (
                  <ChevronRight size={FONT_SIZE} />
                )}
              </span>
              <FolderOpen size={FONT_SIZE} className="text-blue-400" />
              <span className="ml-1 font-semibold">PROJECT ROOT</span>
            </div>
            {expandedPaths.has(rootPath) && renderFileTree(rootPath)}
          </>
        )}
      </div>
    </div>
  );
}

export default FileBrowser;
