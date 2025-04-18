import { createContext, useState, useContext } from "react";
import { readTextFile } from "@tauri-apps/plugin-fs";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  // Application state
  const [fileName, setFileName] = useState("main.cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(
    "// Start coding in C/C++\n\nint main() {\n  // Your code here\n  return 0;\n}"
  );
  const [inputContent, setInputContent] = useState(
    "// Test input data\n5\n10 20 30 40 50"
  );
  const [outputContent, setOutputContent] = useState(
    "// Program output\nSum: 150\nAverage: 30.0"
  );
  const [terminalOutput, setTerminalOutput] = useState(
    "$ g++ -o main main.cpp\n$ ./main\nSum: 150\nAverage: 30.0\n$ _"
  );
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [currentUser] = useState("outlander23");
  const [currentDateTime] = useState("2025-04-14 19:38:05");

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
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
