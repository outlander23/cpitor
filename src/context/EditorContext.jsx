import { createContext, useState, useContext } from "react";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFilePath, setActiveFilePath] = useState("");
  const [theme, setTheme] = useState("vs-dark");

  const [inputContent, setInputContent] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [currentUser] = useState("outlander23");
  const [currentDateTime] = useState("2025-04-14 19:38:05");

  const activeFile = openFiles.find((f) => f.path === activeFilePath);

  const setActiveFile = (path) => {
    setActiveFilePath(path);
  };

  const handleCodeChange = (newCode) => {
    setOpenFiles((prev) =>
      prev.map((f) =>
        f.path === activeFilePath ? { ...f, content: newCode } : f
      )
    );
  };

  const openFile = async (path, name) => {
    const alreadyOpen = openFiles.find((f) => f.path === path);
    if (alreadyOpen) {
      setActiveFilePath(path);
      return;
    }

    try {
      const content = await readTextFile(path);
      const newFile = { path, name, content };
      setOpenFiles((prev) => [...prev, newFile]);
      setActiveFilePath(path);
    } catch (error) {
      console.error("Failed to open file:", error);
    }
  };

  const closeFile = (path) => {
    setOpenFiles((prev) => prev.filter((f) => f.path !== path));
    if (activeFilePath === path) {
      const remaining = openFiles.filter((f) => f.path !== path);
      setActiveFilePath(remaining.length ? remaining[0].path : "");
    }
  };

  const saveFile = async () => {
    const file = openFiles.find((f) => f.path === activeFilePath);
    if (!file) return;

    try {
      await writeTextFile(file.path, file.content);
      console.log("Saved:", file.path);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  const updateTerminalOutput = (output) => {
    setTerminalOutput(output);
  };
  return (
    <EditorContext.Provider
      value={{
        theme,
        setTheme,
        code: activeFile?.content || "",
        handleCodeChange,
        openFile,
        closeFile,
        saveFile,
        openFiles,
        activeFile,
        setActiveFile,
        inputContent,
        setInputContent,
        outputContent,
        setOutputContent,
        setTerminalOutput,
        showFileExplorer,
        toggleFileExplorer: () => setShowFileExplorer((prev) => !prev),
        currentUser,
        currentDateTime,
        terminalOutput,
        updateTerminalOutput,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
