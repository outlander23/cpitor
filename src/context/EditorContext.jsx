import React, { createContext, useState, useContext, useEffect } from "react";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { load } from "@tauri-apps/plugin-store";
import { open } from "@tauri-apps/plugin-dialog";
import { defaultSettings } from "../utils/settings";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [activeView, setActiveView] = useState("home");

  // --- Settings ---
  const [settings, setSettings] = useState(defaultSettings);
  const [store, setStore] = useState(null);
  const [hasSettingsLoaded, setHasSettingsLoaded] = useState(false);

  // --- Editor Files ---
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFilePath, setActiveFilePath] = useState("");
  const [activeFileName, setActiveFileName] = useState("");

  // --- Editor Appearance ---
  const [theme, setTheme] = useState("vs-dark");
  const [showFileExplorer, setShowFileExplorer] = useState(true);

  // --- Directory State ---
  const [isDirOpen, setIsDirOpen] = useState(false);
  const [openDirPath, setOpenDirPath] = useState("");

  // --- IO Content ---
  const [inputContent, setInputContent] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");

  // --- Metadata ---
  const [currentUser] = useState("outlander23");
  const [currentDateTime] = useState("2025-04-14 19:38:05");

  // --- Active File Reference ---
  const activeFile = openFiles.find((f) => f.path === activeFilePath);

  // --------------------------
  // Settings Logic
  // --------------------------
  useEffect(() => {
    async function initStore() {
      try {
        const s = await load("settings.json", { autoSave: true });
        setStore(s);

        const stored = (await s.get("settings")) || {};
        const combined = { ...defaultSettings, ...stored };
        setSettings(combined);
        setHasSettingsLoaded(true);

        console.log("Store initialized:", combined);
      } catch (err) {
        console.error("Failed to load settings:", err);
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
      console.log("Settings updated:", updated);
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  const getSetting = (key) =>
    settings[key] !== undefined ? settings[key] : defaultSettings[key];

  // --------------------------
  // File Logic
  // --------------------------
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
      console.error("Failed to open file:", err);
    }
  };

  // New: open file from load screen
  const openFileFromLoadscreen = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Code Files", extensions: ["cpp"] }],
      });
      if (selected && typeof selected === "string") {
        const parentPath = selected.substring(0, selected.lastIndexOf("/"));
        openFile(selected, selected.split("/").pop());
        setActiveFilePath(selected);
        setIsDirOpen(true);
        setOpenDirPath(parentPath);
        setShowFileExplorer(true);
        setActiveView("editor");
      }
    } catch (err) {
      console.error("Failed to load file via dialog:", err);
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
    if (!file) return;
    try {
      await writeTextFile(file.path, file.content);
    } catch (err) {
      console.error("Error saving file:", err);
    }
  };

  const handleCodeChange = (newCode) => {
    setOpenFiles((prev) =>
      prev.map((f) =>
        f.path === activeFilePath ? { ...f, content: newCode } : f
      )
    );
  };

  const changeView = (view) => {
    setActiveView(view);
  };

  const setActiveFile = (path) => setActiveFilePath(path);
  const updateTerminalOutput = (out) => setTerminalOutput(out);
  const toggleFileExplorer = () => setShowFileExplorer((p) => !p);

  // --------------------------
  // Context Value
  // --------------------------
  const value = {
    // Editor Data
    code: activeFile?.content || "",
    handleCodeChange,
    openFiles,
    activeFile,
    activeFileName,
    setActiveFile,
    openFile,
    openFileFromLoadscreen,
    closeFile,
    saveFile,

    // Settings
    settings,
    updateSettings,
    getSetting,
    hasSettingsLoaded,

    // UI State
    theme,
    setTheme,
    showFileExplorer,
    toggleFileExplorer,
    inputContent,
    setInputContent,
    outputContent,
    setOutputContent,
    terminalOutput,
    updateTerminalOutput,

    // Directory
    isDirOpen,
    setIsDirOpen,
    openDirPath,
    setOpenDirPath,

    // Meta
    currentUser,
    currentDateTime,

    // change view
    activeView,
    changeView,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
