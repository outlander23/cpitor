import { useEffect, useState } from "react";
import { homeDir, resolve } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/plugin-fs";

function FileBrowser() {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const home = await homeDir();
        setCurrentPath(home);
      } catch (error) {
        setError("Failed to initialize: " + error.message);
        console.error("Init error:", error);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!currentPath) return;

    async function fetchFiles() {
      try {
        const contents = await readDir(currentPath);
        const items = [
          { name: ".", isDir: true },
          { name: "..", isDir: true },
          ...contents.map((entry) => ({
            name: entry.name,
            isDir: entry.isDirectory,
          })),
        ];
        setFiles(items);
        setError(null);
      } catch (error) {
        setError("Failed to read directory: " + error.message);
        console.error("Fetch files error:", error);
      }
    }

    fetchFiles();
  }, [currentPath]);

  async function handleDirClick(name) {
    try {
      const newPath = await resolve(currentPath, name);
      setCurrentPath(newPath);
      setError(null);
    } catch (error) {
      setError("Failed to navigate: " + error.message);
      console.error("Navigation error:", error);
    }
  }

  return (
    <div className="file-browser">
      <h2 className="file-browser-title">📁 {currentPath || "Loading..."}</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="file-list">
        {files.length === 0 && !error ? (
          <div className="loading">Loading...</div>
        ) : (
          files.map((file) => (
            <div
              key={file.name}
              className={`file-item ${file.isDir ? "dir" : "file"}`}
              onClick={() => file.isDir && handleDirClick(file.name)}
            >
              {file.isDir ? "📁" : "📄"} {file.name}
              {file.isDir ? "/" : ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FileBrowser;
