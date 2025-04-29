import React from "react";
import "tailwindcss/tailwind.css";
import logo from "../../assets/logo.png";
import { useEditor } from "../../context/EditorContext";

const NoCodeScreen = () => {
  const { settings, theme } = useEditor();
  const colors = settings.themeColors[theme] || settings.themeColors.dark;

  const logoFilter =
    theme === "light" ? "brightness(0.3) contrast(1.2)" : "brightness(1)";

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center transition-colors duration-100 px-4"
      style={{ backgroundColor: colors.editorBackground }}
    >
      <img
        src={logo}
        alt="Cptor Editor Logo"
        className="w-48 sm:w-60 md:w-72 lg:w-80  transition-all duration-300"
        style={{ filter: logoFilter }}
      />
    </div>
  );
};

export default NoCodeScreen;
