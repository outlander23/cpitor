import React, { createContext, useState, useContext, useEffect } from "react";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save, ask } from "@tauri-apps/plugin-dialog";
import { load } from "@tauri-apps/plugin-store";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { defaultSettings } from "../utils/settings";
import { invoke } from "@tauri-apps/api/core";
import { homeDir } from "@tauri-apps/api/path";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  // --- State Variables ---
  const [activeView, setActiveView] = useState("home");
  const [settings, setSettings] = useState(defaultSettings);
  const [store, setStore] = useState(null);
  const [hasSettingsLoaded, setHasSettingsLoaded] = useState(false);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFilePath, setActiveFilePath] = useState("");
  const [activeFileName, setActiveFileName] = useState("");
  const [theme, setTheme] = useState("dark");
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [isDirOpen, setIsDirOpen] = useState(false);
  const [openDirPath, setOpenDirPath] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [currentUser] = useState("outlander23");
  const [currentDateTime] = useState("2025-04-14 19:38:05");
  const [isRunning, setIsRunning] = useState(false);
  const [activeDirectory, setActiveDirectory] = useState("");
  const [recentDirs, setRecentDirs] = useState([]);
  const [currentOpenDir, setCurrentOpenDir] = useState();

  // --- Timer State ---
  const [timerActive, setTimerActive] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const [showTimerFloating, setShowTimerFloating] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimerValue((v) => v + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const startTimer = () => setTimerActive(true);
  const stopTimer = () => setTimerActive(false);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerValue(0);
  };
  const toggleTimerFloating = () => setShowTimerFloating((v) => !v);

  // Derived state
  const activeFile = openFiles.find((f) => f.path === activeFilePath);

  // change view
  const changeView = (view) => {
    if (view === activeView) {
      setActiveView("editor");
    } else {
      setActiveView(view);
    }
  };

  const addRecentFolder = async (folderPath) => {
    let recents = settings.recentOpenedFolders || [];
    recents = recents.filter((item) => item !== folderPath);
    recents.unshift(folderPath);
    recents = recents.slice(0, 3);
    await updateSettings({ recentOpenedFolders: recents });
  };

  const openFolder = async (dir) => {
    try {
      let selected = dir;
      if (!selected) {
        selected = await open({
          directory: true,
          multiple: false,
        });
      }
      if (selected && typeof selected === "string") {
        setOpenDirPath(selected);
        setIsDirOpen(true);
        setShowFileExplorer(true);
        setActiveView("editor");
        setActiveDirectory(selected);
        setCurrentOpenDir(selected);
        await addRecentFolder(selected);
      }
    } catch (err) {
      setTerminalOutput(`Error opening folder: ${err}\n`);
    }
  };

  // --- Settings Logic ---
  useEffect(() => {
    async function initStore() {
      try {
        const s = await load("settings.json", { autoSave: true });
        setStore(s);
        const stored = (await s.get("settings")) || {};
        const combined = { ...defaultSettings, ...stored };
        setSettings(combined);
        setHasSettingsLoaded(true);
        setTheme(combined.theme === "light" ? "light" : "dark");
      } catch (err) {
        setSettings(defaultSettings);
        setHasSettingsLoaded(true);
      }
    }
    initStore();
  }, []);

  const updateSettings = async (newSettings) => {
    if (!store) return;
    try {
      const updated = { ...settings, ...newSettings };
      await store.set("settings", updated);
      await store.save();
      setSettings(updated);
      setHasSettingsLoaded(true);
      setTheme(updated.theme === "light" ? "light" : "dark");
    } catch (err) {}
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const getSetting = (key) =>
    settings[key] !== undefined ? settings[key] : defaultSettings[key];

  // --- File Handling Logic ---
  const openFile = async (path, name) => {
    const exists = openFiles.find((f) => f.path === path);
    if (exists) {
      setActiveFilePath(path);
      return;
    }
    try {
      const content = await readTextFile(path);
      setOpenFiles((prev) => [...prev, { path, name, content }]);
      setActiveFilePath(path);
      setActiveFileName(name);
    } catch (err) {
      setTerminalOutput(`Error opening file: ${err}\n`);
    }
  };

  const openFileFromLoadscreen = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Code Files", extensions: ["cpp"] }],
      });
      if (selected && typeof selected === "string") {
        const parentPath = selected.substring(0, selected.lastIndexOf("/"));
        await openFile(selected, selected.split("/").pop());
        setActiveFilePath(selected);
        setIsDirOpen(true);
        setOpenDirPath(parentPath);
        setShowFileExplorer(true);
        setActiveView("editor");
      }
    } catch (err) {
      setTerminalOutput(`Error loading file: ${err}\n`);
    }
  };

  const closeFile = (path) => {
    const updated = openFiles.filter((f) => f.path !== path);
    setOpenFiles(updated);
    if (activeFilePath === path) {
      setActiveFilePath(updated.length ? updated[0].path : "");
    }
  };

  const saveFile = async () => {
    const file = openFiles.find((f) => f.path === activeFilePath);
    if (!file) {
      setTerminalOutput("Error: No active file to save\n");
      return;
    }
    try {
      await writeTextFile(file.path, file.content);
    } catch (err) {
      throw err; // Re-throw to handle in compileAndRun
    }
  };

  const handleCodeChange = (newCode) => {
    setOpenFiles((prev) =>
      prev.map((f) =>
        f.path === activeFilePath ? { ...f, content: newCode } : f
      )
    );
  };

  // --- Compile and Run Logic ---
  const compileAndRun = async () => {
    if (isRunning) {
      setTerminalOutput("Already running. Please wait.\n");
      return;
    }
    if (!activeFile || !activeFile.path.endsWith(".cpp")) {
      setTerminalOutput("Error: No C++ file selected or invalid file type\n");
      return;
    }

    // Save the file first
    try {
      await saveFile();
    } catch (err) {
      setTerminalOutput(`Error saving file: ${err}\n`);
      return;
    }

    setIsRunning(true);
    setTerminalOutput("");
    setOutputContent("");
    try {
      const response = await invoke("compile_and_run_cpp", {
        filePath: activeFile.path,
        input: inputContent,
        cppenv: settings.cppFlags,
        maxruntime: settings.maxRuntime * 1,
      });

      if (response.success) {
        setTerminalOutput("Compile and run successful\n");
        setOutputContent(response.output);
      } else {
        setTerminalOutput(`Error: ${response.output}\n`);
        setOutputContent("");
      }
    } catch (error) {
      setTerminalOutput(`Unexpected error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearTerminal = () => {
    setTerminalOutput("");
    setOutputContent("");
  };

  // --- Title Bar Logic ---
  const addNewFile = async () => {
    try {
      // 1. Get the user's home directory
      const home = await homeDir();

      // 2. Show the Save As dialog, defaulting to "untitled.cpp" in the home dir
      const defaultName = "untitled.cpp";
      const savePath = await save({
        defaultPath: `${home}/${defaultName}`,
        filters: [{ name: "C++ File", extensions: ["cpp", "h"] }],
      });
      if (!savePath || typeof savePath !== "string") {
        // User cancelled
        return;
      }

      // 3. Create the empty file (or inject boilerplate)
      const fileName = savePath.split("/").pop();
      await writeTextFile(savePath, `// ${fileName}\n\n`);

      // 4. Push it into state & open in editor
      setOpenFiles((prev) => [
        ...prev,
        { path: savePath, name: fileName, content: "" },
      ]);
      setActiveFilePath(savePath);
      setActiveFileName(fileName);

      // 5. Show the explorer & switch to editor view
      setIsDirOpen(true);
      setOpenDirPath(savePath.replace(`/${fileName}`, ""));
      setShowFileExplorer(true);

      setActiveView("editor");
    } catch (err) {
      setTerminalOutput(`Error creating new file: ${err}\n`);
    }
  };

  const addNewFileFromExplorer = async () => {
    try {
      // 1. Get the user's home directory
      const home = activeDirectory || (await homeDir());

      // 2. Show the Save As dialog, defaulting to "untitled.cpp" in the home dir
      const defaultName = "untitled.cpp";
      const savePath = await save({
        defaultPath: `${home}/${defaultName}`,
        filters: [{ name: "C++ File", extensions: ["cpp", "h"] }],
      });
      if (!savePath || typeof savePath !== "string") {
        // User cancelled
        return;
      }

      // 3. Create the empty file (or inject boilerplate)
      const fileName = savePath.split("/").pop();
      await writeTextFile(savePath, `// ${fileName}\n\n`);

      // 4. Push it into state & open in editor
      setOpenFiles((prev) => [
        ...prev,
        { path: savePath, name: fileName, content: "" },
      ]);
      setActiveFilePath(savePath);
      setActiveFileName(fileName);

      // 5. Show the explorer & switch to editor view
      setIsDirOpen(true);
      setShowFileExplorer(true);

      setActiveView("editor");
    } catch (err) {
      setTerminalOutput(`Error creating new file: ${err}\n`);
    }
  };

  const handleNewFile = () => {
    addNewFile();
  };

  const handleOpenFile = async () => {
    try {
      const path = await open({
        filters: [{ name: "Code", extensions: ["cpp"] }],
      });
      if (path && typeof path === "string") {
        await openFile(path, path.split("/").pop());
        setActiveFileName(path);
      }
    } catch (err) {
      setTerminalOutput(`Error opening file: ${err}\n`);
    }
  };

  const handleSave = async () => {
    if (activeFileName) {
      await saveFile();
    } else {
      await handleSaveAs();
    }
  };

  const handleSaveAs = async () => {
    try {
      const path = await save({
        filters: [{ name: "Code", extensions: ["cpp"] }],
      });
      if (path) {
        await writeTextFile(path, activeFile?.content || "");
        setActiveFileName(path);
      }
    } catch (err) {
      setTerminalOutput(`Error saving file: ${err}\n`);
    }
  };

  const handleExit = async () => {
    try {
      await getCurrentWindow().close();
    } catch (err) {}
  };

  const handleMinimize = async () => {
    try {
      const currentWindow = await getCurrentWindow();
      await currentWindow.minimize();
    } catch (err) {}
  };

  const handleFullscreen = async () => {
    try {
      const currentWindow = await getCurrentWindow();
      const isFullscreen = await currentWindow.isFullscreen();
      await currentWindow.setFullscreen(!isFullscreen);
    } catch (err) {
      // handle error if needed
    }
  };

  const handleMenuAction = (label) => {
    switch (label) {
      case "New File":
        handleNewFile();
        break;
      case "Open File...":
        handleOpenFile();
        break;
      case "Save":
        handleSave();
        break;
      case "Save As...":
        handleSaveAs();
        break;
      case "Exit":
        handleExit();
        break;
      case "Run Code":
        compileAndRun();
        break;
      case "Clear Terminal":
        clearTerminal();
        break;
      case "Toggle Full Screen":
        handleFullscreen();
        break;
      case "Minimize":
        handleMinimize();
        break;
      case "Zoom In":
        // TODO: Implement zoom in functionality
        break;
      case "Zoom Out":
        // TODO: Implement zoom out functionality
        break;
      default:
    }
  };

  // --- Context Value ---
  const value = {
    // View and UI
    activeView,
    changeView,
    theme,
    toggleTheme,
    showFileExplorer,
    toggleFileExplorer: () => setShowFileExplorer((p) => !p),
    currentUser,
    currentDateTime,

    // File Handling
    openFiles,
    activeFile,
    activeFilePath,
    activeFileName,
    handleCodeChange,
    openFile,
    openFileFromLoadscreen,
    closeFile,
    saveFile,
    setActiveFile: setActiveFilePath,

    // Title Bar Actions
    handleNewFile,
    handleOpenFile,
    handleSave,
    handleSaveAs,
    handleExit,
    handleMenuAction,

    // Terminal & Run
    compileAndRun,
    terminalOutput,
    updateTerminalOutput: setTerminalOutput,
    inputContent,
    setInputContent,
    outputContent,
    isRunning,
    clearTerminal,

    // Settings
    settings,
    updateSettings,
    getSetting,
    handleFullscreen,

    // Directory
    isDirOpen,
    setIsDirOpen,
    openDirPath,
    setOpenDirPath,
    setActiveDirectory,
    activeDirectory,
    addNewFileFromExplorer,
    openFolder,
    addNewFile,
    recentDirs,
    currentOpenDir,

    // Timer
    timerValue,
    timerActive,
    startTimer,
    stopTimer,
    resetTimer,
    showTimerFloating,
    toggleTimerFloating,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);
