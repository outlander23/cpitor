import { createContext, useState, useContext } from "react";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [openFilePath, setOpenFilePath] = useState("");
  const [fileName, setFileName] = useState("main.cpp");
  const [theme, setTheme] = useState("vs-dark");

  const [code, setCode] = useState("");

  const [inputContent, setInputContent] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [currentUser] = useState("outlander23");
  const [currentDateTime] = useState("2025-04-14 19:38:05");

  const saveFile = async () => {
    try {
      console.log("Saving file:", fileName);
      console.log("Code content:", code);
      await writeTextFile(openFilePath, code);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const toggleFileExplorer = () => {
    console.log("Toggling file explorer");
    setShowFileExplorer((prev) => !prev);
  };

  const runCode = () => {
    setTerminalOutput("");
    setOutputContent("");
  };

  const openFile = async (path, name) => {
    try {
      const content = await readTextFile(path);
      setCode(content);
      setFileName(name);
      setOpenFilePath(path);
      setpath;
    } catch (error) {
      console.error("Failed to open file:", error);
    }
  };

  return (
    <EditorContext.Provider
      value={{
        fileName,
        setFileName,
        theme,
        setTheme,
        code,
        setCode,
        handleCodeChange,
        inputContent,
        setInputContent,
        outputContent,
        setOutputContent,
        terminalOutput,
        setTerminalOutput,
        showFileExplorer,
        toggleFileExplorer,
        currentUser,
        currentDateTime,
        runCode,
        openFile,
        saveFile,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
