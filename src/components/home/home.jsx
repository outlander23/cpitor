import React from "react";
import { FaCode, FaLaptopCode } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

const HomePage = () => {
  const { openFileFromLoadscreen, settings, theme } = useEditor();

  const currentTheme = theme === "dark" || theme === "light" ? theme : "light";
  const palette = settings.themeColors?.[currentTheme] ||
    settings.themeColors?.light || {
      sidebarBackground: "#f5f5f5",
      border: "#dddddd",
      editorForeground: "#333333",
      sidebarForeground: "#333333",
      navbarBackground: "#eaeaea",
      navbarForeground: "#333333",
      lineHighlight: "#f0f0f0",
    };
  const styles = {
    backgroundColor: palette.sidebarBackground,
    color: palette.editorForeground,
  };

  return (
    <div
      className="flex flex-col h-full px-6 py-10 overflow-auto"
      style={styles}
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ color: palette.navbarForeground }}
          >
            🚀 Welcome to Cpitor
          </h1>
          <p
            className="text-lg md:text-xl"
            style={{ color: palette.sidebarForeground }}
          >
            A powerful, modern editor for all your C++ development needs.
          </p>
        </header>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          {/* Start Coding Card */}
          <FeatureCard
            icon={
              <FaCode className="text-3xl" color={palette.editorForeground} />
            }
            title="Start Coding"
            description="Write modern C++ code with IntelliSense, syntax highlighting, and live editing."
            actionLabel="Open File"
            onAction={openFileFromLoadscreen}
            palette={palette}
          />

          {/* Recent Projects Card */}
          <FeatureCard
            icon={
              <FaLaptopCode
                className="text-3xl"
                color={palette.editorForeground}
              />
            }
            title="Recent Projects"
            description="Quickly resume your recent work and projects with one click."
            footer={
              <div
                style={{
                  color: palette.editorForeground,
                  fontStyle: "italic",
                  marginTop: 8,
                }}
              >
                No recent projects
              </div>
            }
            palette={palette}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  footer,
  palette,
}) => (
  <div
    className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200"
    style={{
      backgroundColor: palette.navbarBackground,
      color: palette.editorForeground,
    }}
  >
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <p style={{ color: palette.sidebarForeground }} className="mb-4">
      {description}
    </p>
    {actionLabel && (
      <button
        onClick={onAction}
        style={{
          backgroundColor: palette.navbarForeground,
          color: palette.sidebarBackground,
        }}
        className="px-4 py-2 rounded transition-colors hover:opacity-80"
      >
        {actionLabel}
      </button>
    )}
    {footer}
  </div>
);

export default HomePage;
