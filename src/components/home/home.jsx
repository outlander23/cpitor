import React, { useState } from "react";
import {
  FileCode,
  Github,
  BookOpen,
  Coffee,
  ExternalLink,
  BadgeInfo,
  Settings,
  FolderOpen,
} from "lucide-react";

import logo from "../../assets/logo.png";
import { useEditor } from "../../context/EditorContext";

const HomePage = () => {
  const { settings, theme, openFolder, addNewFile, recentDirs, changeView } =
    useEditor();
  const recentsDirs = settings.recentOpenedFolders || [];
  const currentTheme = theme === "dark" || theme === "light" ? theme : "light";
  const palette = settings.themeColors?.[currentTheme];
  const [hoverCard, setHoverCard] = useState(null);

  const iconColor = palette.editorForeground;

  const quickActions = [
    {
      id: "new-file",
      icon: <FileCode className="h-6 w-6" color={iconColor} />,
      title: "New File",
      description: "Create a new file",
      action: () => addNewFile(),
    },
    {
      id: "open-folder",
      icon: <FolderOpen className="h-6 w-6" color={iconColor} />,
      title: "Open Folder",
      description: "Open a project folder",
      action: () => openFolder(),
    },
    {
      id: "Open-about",
      icon: <BadgeInfo className="h-6 w-6" color={iconColor} />,
      title: "About",
      description: "See the app details",
      action: () => changeView("about"), // Implement as needed
    },
    {
      id: "settings",
      icon: <Settings className="h-6 w-6" color={iconColor} />,
      title: "Settings",
      description: "Customize your editor",
      action: () => changeView("settings"),
    },
  ];

  const resources = [
    {
      id: "docs",
      icon: <BookOpen className="h-5 w-5" color={iconColor} />,
      title: "Documentation",
      url: "#",
    },
    {
      id: "github",
      icon: <Github className="h-5 w-5" color={iconColor} />,
      title: "GitHub Repository",
      url: "#",
    },
    {
      id: "support",
      icon: <Coffee className="h-5 w-5" color={iconColor} />,
      title: "Support Development",
      url: "#",
    },
  ];

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-4 overflow-auto py-10"
      style={{
        background: palette.editorBackground,
        color: palette.editorForeground,
      }}
    >
      <div className="max-w-4xl w-full flex flex-col items-center">
        <img src={logo} alt="Cpitor Logo" className="w-16 h-16 mb-4" />

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div
            className="lg:col-span-2 rounded-lg p-6"
            style={{
              backgroundColor: palette.sidebarBackground,
              border: `1px solid ${palette.border}`,
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start p-4 rounded-md cursor-pointer"
                  style={{
                    backgroundColor:
                      hoverCard === action.id
                        ? currentTheme === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.03)"
                        : "transparent",
                    border: `1px solid ${palette.border}`,
                  }}
                  onClick={action.action}
                  onMouseEnter={() => setHoverCard(action.id)}
                  onMouseLeave={() => setHoverCard(null)}
                >
                  <div
                    className="p-2 rounded-md mr-4"
                    style={{
                      backgroundColor:
                        currentTheme === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm opacity-70">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Folders */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: palette.sidebarBackground,
              border: `1px solid ${palette.border}`,
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Recent Folders</h2>
            <div className="space-y-3">
              {Array.isArray(recentsDirs) && recentsDirs.length === 0 && (
                <div className="text-xs opacity-70">No recent folders.</div>
              )}
              {Array.isArray(recentsDirs) &&
                recentsDirs.map((dir, index) => (
                  <div
                    key={dir}
                    className="flex items-center justify-between p-3 rounded-md cursor-pointer"
                    style={{
                      backgroundColor:
                        hoverCard === `recent-folder-${index}`
                          ? currentTheme === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.03)"
                          : "transparent",
                      border: `1px solid ${palette.border}`,
                    }}
                    onMouseEnter={() => setHoverCard(`recent-folder-${index}`)}
                    onMouseLeave={() => setHoverCard(null)}
                    onClick={() => openFolder(dir)}
                  >
                    <div>
                      <h3 className="font-medium truncate max-w-[150px]">
                        {dir.split("/").pop() || dir}
                      </h3>
                      <div className="text-xs opacity-70 break-all">{dir}</div>
                    </div>
                    <ExternalLink
                      className="h-4 w-4 opacity-60"
                      color={iconColor}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Tips and Resources */}
        <div
          className="w-full mt-6 rounded-lg p-6"
          style={{
            backgroundColor: palette.sidebarBackground,
            border: `1px solid ${palette.border}`,
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold mb-2">Keyboard Tip</h2>
              <p className="opacity-80 mb-2">
                Press{" "}
                <kbd
                  className="px-2 py-0.5 rounded text-sm"
                  style={{ backgroundColor: palette.lineHighlight }}
                >
                  Ctrl+Shift+P
                </kbd>{" "}
                to open the Command Palette
              </p>
              <p className="opacity-80">
                Press{" "}
                <kbd
                  className="px-2 py-0.5 rounded text-sm"
                  style={{ backgroundColor: palette.lineHighlight }}
                >
                  F7
                </kbd>{" "}
                to run the open cpp file
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Resources</h2>
              <div className="space-y-2">
                {resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    className="flex items-center"
                    style={{ color: palette.editorForeground }}
                  >
                    {resource.icon}
                    <span className="ml-2">{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center opacity-60 text-sm">
          <p className="mt-1">Copyright © 2025 Cpitor. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
