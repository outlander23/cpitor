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

  // Defensive fallback for theme and palette
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
        width: 48,
        height: "100vh",
        overflow: "hidden",
        backgroundColor: palette.sidebarBackground,
        borderRight: `1px solid ${palette.border}`,
      }}
    >
      {/* Top group */}
      <div
        style={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 16,
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

      {/* Middle group */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
          padding: 12,
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
          {currentTheme === "dark" ? (
            <FaSun size={20} color={palette.navbarForeground} />
          ) : (
            <FaMoon size={20} color={palette.navbarForeground} />
          )}
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

      {/* Bottom group (empty for now) */}
      <div style={{ padding: 12 }} />
    </div>
  );
}

function ActivityButton({ title, active = false, onClick, children, palette }) {
  const baseStyle = {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    transition: "background-color 0.15s, color 0.15s",
    cursor: "pointer",
    backgroundColor: active ? palette.lineHighlight : "transparent",
    color: active ? palette.editorForeground : palette.sidebarForeground,
    borderLeft: active ? `2px solid ${palette.navbarBackground}` : "none",
  };

  return (
    <button
      title={title}
      onClick={onClick}
      style={baseStyle}
      aria-pressed={active}
      tabIndex={0}
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}
