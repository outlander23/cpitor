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
      action: () => changeView("about"),
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
      url: "https://github.com/outlander23/cpitor/wiki",
    },
    {
      id: "github",
      icon: <Github className="h-5 w-5" color={iconColor} />,
      title: "GitHub Repository",
      url: "https://github.com/outlander23/cpitor/",
    },
    {
      id: "support",
      icon: <Coffee className="h-5 w-5" color={iconColor} />,
      title: "Support Development",
      url: "https://github.com/outlander23/cpitor/",
    },
  ];

  return (
    <div
      className="w-full h-full min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 overflow-auto py-6 sm:py-10"
      style={{
        background: palette.editorBackground,
        color: palette.editorForeground,
      }}
    >
      <div className="max-w-5xl w-full flex flex-col items-center">
        {/* Centered Logo With Responsive Sizing */}
        <div className="flex flex-col items-center mb-4 w-full">
          <img
            src={logo}
            alt="Cpitor Logo"
            className="my-4"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
              maxWidth: "100%",
              borderRadius: "16px",
              boxShadow:
                currentTheme === "dark"
                  ? "0 2px 12px rgba(0,0,0,0.5)"
                  : "0 2px 12px rgba(0,0,0,0.08)",
              background: palette.sidebarBackground,
              border: `2px solid ${palette.border}`,
            }}
          />
          {/* <h1 className="text-2xl font-bold tracking-tight mt-1 mb-4 text-center">
            Cpitor
          </h1> */}
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div
            className="lg:col-span-2 rounded-lg p-6 h-full"
            style={{
              backgroundColor: palette.sidebarBackground,
              border: `1px solid ${palette.border}`,
              minHeight: 260,
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start p-4 rounded-md cursor-pointer transition-colors"
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
                      minWidth: 40,
                      minHeight: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
            className="rounded-lg p-6 h-full"
            style={{
              backgroundColor: palette.sidebarBackground,
              border: `1px solid ${palette.border}`,
              minHeight: 260,
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
                    className="flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors"
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
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.icon}
                    <span className="ml-2">{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
