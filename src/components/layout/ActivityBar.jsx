import React from "react";
import {
  FaHome,
  FaFolderOpen,
  FaCog,
  FaSun,
  FaMoon,
  FaBook,
  FaInfoCircle,
  FaClock,
} from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function ActivityBar() {
  const {
    showFileExplorer,
    toggleFileExplorer,
    changeView,
    activeView,
    theme,
    toggleTheme,
    settings,
  } = useEditor();

  const currentTheme = theme === "dark" || theme === "light" ? theme : "light";
  const palette = settings?.themeColors?.[currentTheme] ||
    settings?.themeColors?.light || {
      sidebarBackground: "#f5f5f5",
      border: "#dddddd",
      editorForeground: "#333333",
      sidebarForeground: "#333333",
      navbarBackground: "#eaeaea",
      navbarForeground: "#333333",
      lineHighlight: "#f0f0f0",
    };

  const goHome = () => changeView("home");
  const openSettings = () => changeView("settings");
  const openEditor = () => changeView("editor");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 44,
        height: "100vh",
        backgroundColor: palette.sidebarBackground,
        borderRight: `1px solid ${palette.border}`,
        padding: "12px 0",
        boxSizing: "border-box",
      }}
    >
      {/* Top Group */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
        }}
      >
        <ActivityButton
          title="Home"
          active={activeView === "home"}
          onClick={goHome}
          palette={palette}
        >
          <FaHome size={20} />
        </ActivityButton>

        <ActivityButton
          title="Explorer"
          active={showFileExplorer && activeView === "editor"}
          onClick={() => {
            toggleFileExplorer();
            openEditor();
          }}
          palette={palette}
        >
          <FaFolderOpen size={20} />
        </ActivityButton>

        <ActivityButton title="Timer" palette={palette}>
          <FaClock size={20} />
        </ActivityButton>
      </div>

      {/* Middle Group */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          paddingTop: 30,
        }}
      >
        <ActivityButton
          title="Docs"
          active={activeView === "docs"}
          onClick={() => changeView("docs")}
          palette={palette}
        >
          <FaBook size={20} />
        </ActivityButton>

        <ActivityButton
          title="About"
          active={activeView === "about"}
          onClick={() => changeView("about")}
          palette={palette}
        >
          <FaInfoCircle size={20} />
        </ActivityButton>

        <ActivityButton
          title="Toggle Theme"
          onClick={toggleTheme}
          palette={palette}
        >
          {currentTheme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
        </ActivityButton>

        <ActivityButton
          title="Settings"
          active={activeView === "settings"}
          onClick={openSettings}
          palette={palette}
        >
          <FaCog size={20} />
        </ActivityButton>
      </div>

      {/* Bottom Padding */}
      <div style={{ height: 20 }} />
    </div>
  );
}

function ActivityButton({ title, active = false, onClick, children, palette }) {
  const baseStyle = {
    width: 32,
    height: 32,
    borderRadius: "12px",
    backgroundColor: active ? palette.lineHighlight : "transparent",
    color: active ? palette.editorForeground : palette.sidebarForeground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: active ? `inset 2px 0 0 ${palette.navbarBackground}` : "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    outline: "none",
    border: "none",
  };

  const hoverStyle = {
    ...baseStyle,
    ":hover": {
      backgroundColor: palette.lineHighlight,
      transform: "scale(1.05)",
    },
  };

  return (
    <button
      title={title}
      onClick={onClick}
      style={baseStyle}
      aria-pressed={active}
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}
