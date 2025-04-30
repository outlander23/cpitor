export const defaultSettings = {
  theme: "dark", // "light" | "dark"
  themeColors: {
    light: {
      editorBackground: "#ffffff",
      editorForeground: "#1e1e1e", // Darker for better contrast
      gutterBackground: "#f5f5f5", // Slightly darker for better visibility
      gutterForeground: "#5a5a5a", // Darker for better readability
      lineHighlight: "#e3effc", // Slightly more saturated blue tint
      border: "#e0e0e0", // Slightly darker for better definition
      sidebarBackground: "#f3f3f3", // More neutral tone
      sidebarForeground: "#333333", // Darker for better contrast
      navbarBackground: "#e7e7e7", // More neutral gray
      navbarForeground: "#333333", // Darker for better contrast
      terminalBackground: "#f8f8f8", // Slightly darker for better contrast with text
      terminalForeground: "#121212", // Near black for maximum readability
      ioPanelBackground: "#f5f5f5", // Consistent with other backgrounds
      ioPanelForeground: "#333333", // Darker for better contrast
      borderHover: "#999999", // Darker for better visibility on hover
      // Additional colors for syntax highlighting
      syntaxKeyword: "#0000ff", // Blue for keywords
      syntaxString: "#a31515", // Red for strings
      syntaxComment: "#008000", // Green for comments
      syntaxFunction: "#795e26", // Brown for functions
      syntaxVariable: "#001080", // Dark blue for variables
      syntaxNumber: "#098658", // Green for numbers
      syntaxOperator: "#000000", // Black for operators
      syntaxType: "#267f99", // Teal for types
      // Status indicators
      errorForeground: "#d32f2f", // Red for errors
      warningForeground: "#e69d00", // Amber for warnings
      successForeground: "#388e3c", // Green for success
      infoForeground: "#0288d1", // Blue for info
    },
    dark: {
      editorBackground: "#1e1e1e", // VS Code dark theme background
      editorForeground: "#d4d4d4", // Standard light gray text
      gutterBackground: "#1e1e1e", // Match editor background
      gutterForeground: "#858585", // Medium gray for line numbers
      lineHighlight: "#2a2d2e", // Slightly lighter than background
      border: "#3c3c3c", // Medium gray borders
      sidebarBackground: "#252526", // VS Code sidebar color
      sidebarForeground: "#cccccc", // Light gray text
      navbarBackground: "#333333", // Slightly lighter than editor
      navbarForeground: "#ffffff", // White text for contrast
      terminalBackground: "#1e1e1e", // Match editor background
      terminalForeground: "#ffffff", // White text for terminal
      ioPanelBackground: "#1e1e1e", // Match editor background
      ioPanelForeground: "#cccccc", // Light gray text
      borderHover: "#5a5a5a", // Lighter gray for hover states
      // Additional colors for syntax highlighting
      syntaxKeyword: "#569cd6", // Blue for keywords
      syntaxString: "#ce9178", // Orange for strings
      syntaxComment: "#6a9955", // Green for comments
      syntaxFunction: "#dcdcaa", // Yellow for functions
      syntaxVariable: "#9cdcfe", // Light blue for variables
      syntaxNumber: "#b5cea8", // Light green for numbers
      syntaxOperator: "#d4d4d4", // Light gray for operators
      syntaxType: "#4ec9b0", // Teal for types
      // Status indicators
      errorForeground: "#f44747", // Red for errors
      warningForeground: "#ff9e64", // Orange for warnings
      successForeground: "#6a9955", // Green for success
      infoForeground: "#569cd6", // Blue for info
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
