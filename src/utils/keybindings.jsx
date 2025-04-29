// src/constants/Keybindings.jsx

const Keybindings = {
  File: [
    { label: "New File", shortcut: "Ctrl+N", command: "newFile" },
    { label: "Open File...", shortcut: "Ctrl+O", command: "openFile" },
    { label: "Save", shortcut: "Ctrl+S", command: "saveFile" },
    { label: "Save As...", shortcut: "Ctrl+Shift+S", command: "saveFileAs" },
    { label: "Exit", shortcut: "Ctrl+Q", command: "exitApp" },
  ],

  Edit: [
    { label: "Undo", shortcut: "Ctrl+Z", command: "undo" },
    { label: "Redo", shortcut: "Ctrl+Y", command: "redo" },
    { label: "Cut", shortcut: "Ctrl+X", command: "cut" },
    { label: "Copy", shortcut: "Ctrl+C", command: "copy" },
    { label: "Paste", shortcut: "Ctrl+V", command: "paste" },
  ],

  View: [
    {
      label: "Toggle Full Screen",
      shortcut: "F11",
      command: "toggleFullScreen",
    },
    { label: "Zoom In", shortcut: "Ctrl++", command: "zoomIn" },
    { label: "Zoom Out", shortcut: "Ctrl+-", command: "zoomOut" },
  ],

  Run: [
    {
      label: "Run Code",
      shortcut: "F7",
      command: "runWithoutDebugging",
    },
  ],

  Help: [
    { label: "View Help", shortcut: "F1", command: "viewHelp" },
    { label: "About", shortcut: "", command: "about" },
  ],
};

export default Keybindings;
