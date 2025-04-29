export const defaultSettings = {
  theme: "light", // "light" | "dark"
  themeColors: {
    light: {
      editorBackground: "#ffffff",
      editorForeground: "#222222",
      gutterBackground: "#f3f3f3",
      gutterForeground: "#666666",
      lineHighlight: "#e7f0fa",
      border: "#cccccc",
      sidebarBackground: "#f0f0f5",
      sidebarForeground: "#222222",
      navbarBackground: "#e3e6ea",
      navbarForeground: "#222222",
      terminalBackground: "#f6f6f6",
      terminalForeground: "#000000",
      ioPanelBackground: "#fafbfc",
      ioPanelForeground: "#222222",
      borderHover: "#aaaaaa",
    },
    dark: {
      borderHover: "#4b4b4b",
      editorBackground: "#1e1e1e",
      editorForeground: "#d4d4d4",
      gutterBackground: "#21232b",
      gutterForeground: "#858585",
      lineHighlight: "#2c2c2c",
      border: "#3c3c3c",
      sidebarBackground: "#23242a",
      sidebarForeground: "#d4d4d4",
      navbarBackground: "#26272b",
      navbarForeground: "#fafafa",
      terminalBackground: "#18191c",
      terminalForeground: "#fafafa",
      ioPanelBackground: "#1e1e1e",
      ioPanelForeground: "#cccccc",
    },
  },
  fontSizes: {
    navbar: 14, // px
    browser: 16, // px
    terminal: 14, // px
    codeEditor: 14, // px
  },
  // Editor-specific toggles:
  minimap: true,
  autoSave: true,
  autoSaveDelay: 1000, // ms
  fontFamily: "'Cascadia Code', 'Fira Code', monospace",
  formatOnType: true,
  formatOnPaste: true,
  bracketPairColorization: true,
  codeFolding: true,
  maxRuntime: 2,
  cppFlags: "ONPC",
};
