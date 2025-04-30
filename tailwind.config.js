/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shared
        border: "var(--tw-color-border)",
        input: "var(--tw-color-input)",
        ring: "var(--tw-color-ring)",
        background: "var(--tw-color-background)",
        foreground: "var(--tw-color-foreground)",

        // Light Theme (from user palette)
        "light-editor-bg": "#ffffff",
        "light-editor-fg": "#1e1e1e",
        "light-gutter-bg": "#f5f5f5",
        "light-gutter-fg": "#5a5a5a",
        "light-line-highlight": "#e3effc",
        "light-sidebar-bg": "#f3f3f3",
        "light-sidebar-fg": "#333333",
        "light-navbar-bg": "#e7e7e7",
        "light-navbar-fg": "#333333",
        "light-terminal-bg": "#f8f8f8",
        "light-terminal-fg": "#121212",
        "light-io-bg": "#f5f5f5",
        "light-io-fg": "#333333",
        "light-border-hover": "#999999",
        // syntax
        "light-syntax-keyword": "#0000ff",
        "light-syntax-string": "#a31515",
        "light-syntax-comment": "#008000",
        "light-syntax-function": "#795e26",
        "light-syntax-variable": "#001080",
        "light-syntax-number": "#098658",
        "light-syntax-operator": "#000000",
        "light-syntax-type": "#267f99",
        // status
        "light-error-fg": "#d32f2f",
        "light-warning-fg": "#e69d00",
        "light-success-fg": "#388e3c",
        "light-info-fg": "#0288d1",

        // Dark Theme (from user palette)
        "dark-editor-bg": "#1e1e1e",
        "dark-editor-fg": "#d4d4d4",
        "dark-gutter-bg": "#1e1e1e",
        "dark-gutter-fg": "#858585",
        "dark-line-highlight": "#2a2d2e",
        "dark-sidebar-bg": "#252526",
        "dark-sidebar-fg": "#cccccc",
        "dark-navbar-bg": "#333333",
        "dark-navbar-fg": "#ffffff",
        "dark-terminal-bg": "#1e1e1e",
        "dark-terminal-fg": "#ffffff",
        "dark-io-bg": "#1e1e1e",
        "dark-io-fg": "#cccccc",
        "dark-border-hover": "#5a5a5a",
        // syntax
        "dark-syntax-keyword": "#569cd6",
        "dark-syntax-string": "#ce9178",
        "dark-syntax-comment": "#6a9955",
        "dark-syntax-function": "#dcdcaa",
        "dark-syntax-variable": "#9cdcfe",
        "dark-syntax-number": "#b5cea8",
        "dark-syntax-operator": "#d4d4d4",
        "dark-syntax-type": "#4ec9b0",
        // status
        "dark-error-fg": "#f44747",
        "dark-warning-fg": "#ff9e64",
        "dark-success-fg": "#6a9955",
        "dark-info-fg": "#569cd6",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [plugin],
};
