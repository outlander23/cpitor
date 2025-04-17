import { useEffect, useState } from "react";
import { homeDir, resolve, basename } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/plugin-fs";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  FolderOpen,
} from "lucide-react";

function FileBrowser() {
  const [fileTree, setFileTree] = useState({});
  const [expandedPaths, setExpandedPaths] = useState(new Set());
  const [rootPath, setRootPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const home = await homeDir();
        setRootPath(home);
        await loadDirectory(home);
        setExpandedPaths(new Set([home]));
      } catch (error) {
        setError("Failed to initialize: " + error.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function loadDirectory(dirPath) {
    try {
      const contents = await readDir(dirPath);

      // Sort directories first, then files, both alphabetically
      const sortedContents = contents.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      // Filter out hidden files/folders
      const visibleContents = sortedContents.filter(
        (item) => !item.name.startsWith(".")
      );

      // Process each item, ensuring the path is properly constructed
      const processedItems = await Promise.all(
        visibleContents.map(async (item) => {
          // Construct the full path by combining the directory path with the item name
          const itemPath = await resolve(dirPath, item.name);

          return {
            name: item.name,
            path: itemPath, // Use our properly constructed path
            isDir: item.isDirectory,
            children: item.isDirectory ? null : undefined, // null means not loaded yet
          };
        })
      );

      setFileTree((prev) => ({
        ...prev,
        [dirPath]: processedItems,
      }));

      return processedItems;
    } catch (error) {
      setError(`Failed to read directory: ${error.message}`);
      return [];
    }
  }

  async function handleToggleDirectory(path, isExpanded) {
    try {
      const newExpandedPaths = new Set(expandedPaths);

      if (isExpanded) {
        newExpandedPaths.delete(path);
      } else {
        newExpandedPaths.add(path);
        // Load directory contents if not loaded yet
        if (!fileTree[path]) {
          await loadDirectory(path);
        }
      }

      setExpandedPaths(newExpandedPaths);
    } catch (error) {
      setError("Failed to toggle directory: " + error.message);
      console.error("Directory toggle error:", error);
    }
  }

  function renderFileTree(dirPath, depth = 0) {
    const contents = fileTree[dirPath];
    if (!contents) return null;

    return contents.map((item) => {
      const fullPath = item.path;
      const isExpanded = expandedPaths.has(fullPath);

      return (
        <div key={fullPath}>
          <div
            className={`flex items-center py-1 px-2 hover:bg-zinc-700 rounded cursor-pointer`}
            style={{ paddingLeft: `${depth * 16 + 4}px` }}
            onClick={() =>
              item.isDir && handleToggleDirectory(fullPath, isExpanded)
            }
          >
            {item.isDir ? (
              <div className="flex items-center gap-1 text-blue-400">
                <span className="w-4">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
                {isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />}
                <span className="ml-1 truncate">{item.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-300">
                <span className="w-4"></span>
                <FileText size={16} />
                <span className="ml-1 truncate">{item.name}</span>
              </div>
            )}
          </div>

          {/* Render children if directory is expanded */}
          {item.isDir && isExpanded && renderFileTree(fullPath, depth + 1)}
        </div>
      );
    });
  }

  return (
    <div className="bg-zinc-900 text-white w-full max-w-md h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-zinc-700">
        <h2 className="text-sm font-medium uppercase text-gray-400">
          EXPLORER
        </h2>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-1">
        {loading ? (
          <div className="text-gray-400 p-2">Loading...</div>
        ) : error ? (
          <div className="text-red-400 p-2">{error}</div>
        ) : (
          <div className="text-sm">
            {/* Root folder title */}
            <div
              className="flex items-center py-1 px-2 hover:bg-zinc-700 rounded cursor-pointer"
              onClick={() =>
                handleToggleDirectory(rootPath, expandedPaths.has(rootPath))
              }
            >
              <span className="w-4">
                {expandedPaths.has(rootPath) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </span>
              <FolderOpen size={16} className="text-blue-400" />
              <span className="ml-1 font-semibold">PROJECT ROOT</span>
            </div>

            {/* Render children */}
            {expandedPaths.has(rootPath) && renderFileTree(rootPath)}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileBrowser;
