import React, { createContext, useState, useContext, useEffect } from "react";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";
import { load } from "@tauri-apps/plugin-store";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { defaultSettings } from "../utils/settings";
import { invoke } from "@tauri-apps/api/core";
import { homeDir, basename, dirname, join } from "@tauri-apps/api/path";
import init, { format } from "@wasm-fmt/clang-format";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  // --- State Variables ---
  const [activeFile, setActiveFile] = useState(null);
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

  // Timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const [showTimerFloating, setShowTimerFloating] = useState(false);

  // wasm formatter readiness
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    init()
      .then(() => {
        if (mounted) setWasmReady(true);
      })
      .catch(() => {
        if (mounted) setWasmReady(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

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

  // Sync activeFile whenever openFiles or activeFilePath changes
  useEffect(() => {
    const file = openFiles.find((f) => f.path === activeFilePath) || null;
    setActiveFile(file);
  }, [openFiles, activeFilePath]);

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

  // Settings load
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

  // --- File Handling ---
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
        const name = await basename(selected);
        const parentPath = await dirname(selected);
        await openFile(selected, name);
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
      let formatted = file.content;

      if (wasmReady && typeof format === "function") {
        try {
          const maybe = format(file.content, file.name || "main.cpp", "Google");
          formatted =
            maybe && typeof maybe.then === "function" ? await maybe : maybe;
        } catch (fmtErr) {
          setTerminalOutput((t) => `${t}Formatting failed: ${fmtErr}\n`);
          // fall back to original content
          formatted = file.content;
        }
      }

      await writeTextFile(file.path, formatted);

      // update openFiles and activeFile to reflect saved content
      setOpenFiles((prev) =>
        prev.map((f) =>
          f.path === file.path ? { ...f, content: formatted } : f
        )
      );

      setActiveFile((prev) =>
        prev && prev.path === file.path ? { ...prev, content: formatted } : prev
      );

      console.log("Saved file:", file.path);
    } catch (err) {
      setTerminalOutput(`Error saving file: ${err}\n`);
      throw err;
    }
  };

  const handleCodeChange = (newCode) => {
    const data = openFiles.map((f) =>
      f.path === activeFilePath ? { ...f, content: newCode } : f
    );
    setOpenFiles(data);
  };

  // --- Compile and Run ---
  const compileAndRun = async () => {
    if (isRunning) {
      setTerminalOutput("Already running. Please wait.\n");
      return;
    }
    if (!activeFile || !activeFile.path || !activeFile.path.endsWith(".cpp")) {
      setTerminalOutput("Error: No C++ file selected or invalid file type\n");
      return;
    }

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

  // --- Titlebar & file creation ---
  const addNewFile = async () => {
    try {
      const home = await homeDir();
      const defaultName = "untitled.cpp";
      const defaultPath = await join(home, defaultName);
      const savePath = await save({
        defaultPath,
        filters: [{ name: "C++ File", extensions: ["cpp", "h"] }],
      });
      if (!savePath || typeof savePath !== "string") return;

      const fileName = await basename(savePath);
      await writeTextFile(savePath, `// ${fileName}\n\n`);

      setOpenFiles((prev) => [
        ...prev,
        { path: savePath, name: fileName, content: "" },
      ]);
      setActiveFilePath(savePath);
      setActiveFileName(fileName);
      setIsDirOpen(true);
      setOpenDirPath(await dirname(savePath));
      setShowFileExplorer(true);
      setActiveView("editor");
    } catch (err) {
      setTerminalOutput(`Error creating new file: ${err}\n`);
    }
  };

  const addNewFileInDirectory = async (dir) => {
    try {
      const baseDir = dir || activeDirectory || (await homeDir());
      const defaultName = "untitled.cpp";
      const defaultPath = `${baseDir}${
        baseDir.endsWith("/") || baseDir.endsWith("\\") ? "" : "/"
      }${defaultName}`;

      const savePath = await save({
        defaultPath,
        filters: [{ name: "C++ File", extensions: ["cpp", "h"] }],
      });

      if (!savePath || typeof savePath !== "string") return null;

      const fileName = await basename(savePath);
      const initialContent = `// ${fileName}\n\n`;
      await writeTextFile(savePath, initialContent);

      setOpenFiles((prev) => {
        if (prev.find((f) => f.path === savePath)) return prev;
        return [
          ...prev,
          { path: savePath, name: fileName, content: initialContent },
        ];
      });

      setActiveFilePath(savePath);
      setActiveFileName(fileName);
      setActiveFile({
        path: savePath,
        name: fileName,
        content: initialContent,
      });
      setIsDirOpen(true);
      setOpenDirPath(await dirname(savePath));
      setShowFileExplorer(true);
      setActiveView("editor");
      await addRecentFolder(await dirname(savePath));
      return savePath;
    } catch (err) {
      setTerminalOutput(`Error creating file: ${err}\n`);
      return null;
    }
  };

  const addNewFileFromExplorer = async () =>
    addNewFileInDirectory(activeDirectory);

  const handleNewFile = () => addNewFile();

  const handleOpenFile = async () => {
    try {
      const path = await open({
        filters: [{ name: "Code", extensions: ["cpp"] }],
      });
      if (path && typeof path === "string") {
        const name = await basename(path);
        await openFile(path, name);
        setActiveFileName(name);
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
        setActiveFileName(await basename(path));
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
    } catch (err) {}
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
      default:
    }
  };

  // --- Context Value ---
  const value = {
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
    setActiveFilePath,

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
    addNewFileInDirectory,
    openFolder,
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
