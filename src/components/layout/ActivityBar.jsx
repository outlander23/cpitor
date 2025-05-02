import React from "react";
import {
  FileCode,
  GitBranch,
  Search as LucideSearch,
  Bug,
  Package,
  User,
  Settings as LucideSettings,
  Sun,
  Moon,
  BadgeInfo,
  Home,
} from "lucide-react";
import { useEditor } from "../../context/EditorContext";

export default function ActivityBar() {
  const {
    showFileExplorer,
    toggleFileExplorer,
    changeView,
    activeView,
    theme,
    toggleTheme,
  } = useEditor();

  const isDark = theme === "dark";
  const hoverBg = isDark
    ? "dark:bg-dark-bg-tertiary"
    : "hover:bg-light-bg-tertiary";
  const hoverText = isDark ? "hover:text-white" : "hover:text-gray-800";

  const items = [
    {
      icon: <Home className="h-5 w-5" />,
      action: () => changeView("home"),
      active: activeView === "home",
      label: "home",
    },
    {
      icon: <FileCode className="h-5 w-5" />,
      action: () => {
        toggleFileExplorer();
        changeView("editor");
      },
      active: showFileExplorer && activeView === "editor",
      label: "Explorer",
    },
    {
      icon: <GitBranch className="h-5 w-5" />,
      action: () => changeView("sourceControl"),
      active: activeView === "sourceControl",
      label: "Source Control",
    },
    {
      icon: <Bug className="h-5 w-5" />,
      action: () => changeView("debug"),
      active: activeView === "debug",
      label: "Run & Debug",
    },
    {
      icon: <Package className="h-5 w-5" />,
      action: () => changeView("extensions"),
      active: activeView === "extensions",
      label: "Extensions",
    },
  ];

  const bottom = [
    {
      icon: isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5 text-gray-800" />
      ),
      action: toggleTheme,
      active: false,
      label: "Toggle Theme",
      special: true,
    },
    {
      icon: <BadgeInfo className="h-5 w-5" />,
      action: () => changeView("about"),
      active: activeView === "about",
      label: "About",
    },
    {
      icon: <LucideSettings className="h-5 w-5" />,
      action: () => changeView("settings"),
      active: activeView === "settings",
      label: "Settings",
    },
  ];

  return (
    <div className="w-12 bg-light-bg-secondary dark:bg-dark-bg-secondary flex flex-col items-center py-2">
      <div className="flex flex-col items-center space-y-4 flex-1">
        {items.map(({ icon, action, active, label }) => (
          <button
            key={label}
            onClick={action}
            title={label}
            className={`
              relative p-2 rounded transition-colors flex items-center justify-center
              ${
                active
                  ? "text-[#3794ff] dark:text-[#3794ff]"
                  : `text-gray-500 dark:text-dark-text-secondary ${hoverText}`
              }
              ${active ? "bg-transparent" : hoverBg}
              cursor-pointer
            `}
          >
            {active && (
              <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#3794ff] rounded-r-sm" />
            )}
            {icon}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4 mt-auto">
        {bottom.map(({ icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            title={label}
            className={`
              p-2 rounded transition-colors flex items-center justify-center
              ${
                label === "Toggle Theme"
                  ? "" /* no active indicator */
                  : activeView === label.toLowerCase()
                  ? "text-[#3794ff] dark:text-[#3794ff]"
                  : `text-gray-500 dark:text-dark-text-secondary ${hoverText}`
              }
              ${hoverBg}
              cursor-pointer
            `}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
