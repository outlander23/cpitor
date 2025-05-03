"use client";

import { useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { ChevronDown, ChevronRight, Check, Save } from "lucide-react";

export default function SettingsPage() {
  const [showSaved, setShowSaved] = useState(false);
  const { settings, updateSettings, toggleTheme, theme } = useEditor();
  // use localSettings for preview; palette comes from localSettings.theme
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeCategory, setActiveCategory] = useState("commonly-used");
  // Only one section open at a time
  const [openSection, setOpenSection] = useState("editor");

  const palette = localSettings.themeColors[localSettings.theme];

  // Only one section can be open at a time
  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleChange = (key, value) => {
    setLocalSettings((prev) => {
      if (key === "cppFlags") {
        try {
          return { ...prev, [key]: JSON.parse(value) };
        } catch {
          return prev;
        }
      }

      return { ...prev, [key]: value };
    });

    if (key === "theme") {
      toggleTheme();
    }
  };

  const handleFontSizeChange = (component, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      fontSizes: {
        ...prev.fontSizes,
        [component]: Number(value),
      },
    }));
  };

  const handleSave = () => {
    setShowSaved(true);
    updateSettings(localSettings);
    setTimeout(() => setShowSaved(false), 1200);
  };

  const categories = [{ id: "commonly-used", name: "Commonly Used" }];

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{
        background: palette.editorBackground,
        color: palette.editorForeground,
      }}
    >
      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">
          {categories.find((c) => c.id === activeCategory)?.name || "Settings"}
        </h1>

        {/* Editor Section */}
        <div
          className="mb-4 border rounded-md overflow-hidden"
          style={{ borderColor: palette.border }}
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            style={{ background: palette.sidebarBackground }}
            onClick={() => toggleSection("editor")}
          >
            <div className="flex items-center">
              <span className="mr-2">📝</span>
              <span>Editor</span>
            </div>
            {openSection === "editor" ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>

          {openSection === "editor" && (
            <div
              className="p-4 space-y-6"
              style={{ background: palette.editorBackground }}
            >
              {/* Font Size */}
              <div>
                <div className="flex justify-between mb-1">
                  <div>
                    <div className="font-medium">Font Size</div>
                    <div className="text-sm opacity-70">
                      Controls the font size in pixels.
                    </div>
                  </div>
                  <input
                    type="number"
                    value={localSettings.fontSizes.codeEditor}
                    onChange={(e) =>
                      handleFontSizeChange("codeEditor", e.target.value)
                    }
                    className="w-32 px-2 py-1 rounded"
                    style={{
                      background: palette.gutterBackground,
                      color: palette.editorForeground,
                      border: `1px solid ${palette.border}`,
                    }}
                  />
                </div>
              </div>

              {/* Font Family */}
              <div>
                <div className="flex justify-between mb-1">
                  <div>
                    <div className="font-medium">Font Family</div>
                    <div className="text-sm opacity-70">
                      Controls the font family.
                    </div>
                  </div>
                  <div className="relative w-48">
                    <input
                      type="text"
                      value={localSettings.fontFamily}
                      onChange={(e) =>
                        handleChange("fontFamily", e.target.value)
                      }
                      className="w-full px-2 py-1 rounded"
                      style={{
                        background: palette.gutterBackground,
                        color: palette.editorForeground,
                        border: `1px solid ${palette.border}`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Word Wrap */}
              <div>
                <div className="flex justify-between mb-1 items-center">
                  <div>
                    <div className="font-medium">Word Wrap</div>
                    <div className="text-sm opacity-70">
                      Controls how lines should wrap.
                    </div>
                  </div>
                  <label className="flex items-center gap-2 select-none">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded ${
                        localSettings.wordWrap
                          ? "bg-blue-600 border-blue-600"
                          : ""
                      }`}
                      style={{
                        borderColor: palette.border,
                      }}
                      onClick={() =>
                        handleChange("wordWrap", !localSettings.wordWrap)
                      }
                    >
                      {localSettings.wordWrap && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span>Enabled</span>
                  </label>
                </div>
              </div>

              {/* Format On Type */}
              <div>
                <div className="flex justify-between mb-1 items-center">
                  <div>
                    <div className="font-medium">Format On Type</div>
                    <div className="text-sm opacity-70">
                      Format the document while typing.
                    </div>
                  </div>
                  <label className="flex items-center gap-2 select-none">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded ${
                        localSettings.formatOnType
                          ? "bg-blue-600 border-blue-600"
                          : ""
                      }`}
                      style={{
                        borderColor: palette.border,
                      }}
                      onClick={() =>
                        handleChange(
                          "formatOnType",
                          !localSettings.formatOnType
                        )
                      }
                    >
                      {localSettings.formatOnType && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span>Enabled</span>
                  </label>
                </div>
              </div>

              {/* Format On Paste */}
              <div>
                <div className="flex justify-between mb-1 items-center">
                  <div>
                    <div className="font-medium">Format On Paste</div>
                    <div className="text-sm opacity-70">
                      Format pasted content.
                    </div>
                  </div>
                  <label className="flex items-center gap-2 select-none">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded ${
                        localSettings.formatOnPaste
                          ? "bg-blue-600 border-blue-600"
                          : ""
                      }`}
                      style={{
                        borderColor: palette.border,
                      }}
                      onClick={() =>
                        handleChange(
                          "formatOnPaste",
                          !localSettings.formatOnPaste
                        )
                      }
                    >
                      {localSettings.formatOnPaste && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span>Enabled</span>
                  </label>
                </div>
              </div>

              {/* Bracket Pair Colorization */}
              <div>
                <div className="flex justify-between mb-1 items-center">
                  <div>
                    <div className="font-medium">Bracket Pair Colorization</div>
                    <div className="text-sm opacity-70">
                      Colorize matching brackets.
                    </div>
                  </div>
                  <label className="flex items-center gap-2 select-none">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded ${
                        localSettings.bracketPairColorization
                          ? "bg-blue-600 border-blue-600"
                          : ""
                      }`}
                      style={{
                        borderColor: palette.border,
                      }}
                      onClick={() =>
                        handleChange(
                          "bracketPairColorization",
                          !localSettings.bracketPairColorization
                        )
                      }
                    >
                      {localSettings.bracketPairColorization && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span>Enabled</span>
                  </label>
                </div>
              </div>

              {/* Code Folding */}
              <div>
                <div className="flex justify-between mb-1 items-center">
                  <div>
                    <div className="font-medium">Code Folding</div>
                    <div className="text-sm opacity-70">
                      Enable code folding in the editor.
                    </div>
                  </div>
                  <label className="flex items-center gap-2 select-none">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded ${
                        localSettings.codeFolding
                          ? "bg-blue-600 border-blue-600"
                          : ""
                      }`}
                      style={{
                        borderColor: palette.border,
                      }}
                      onClick={() =>
                        handleChange("codeFolding", !localSettings.codeFolding)
                      }
                    >
                      {localSettings.codeFolding && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span>Enabled</span>
                  </label>
                </div>
              </div>

              {/* Minimap */}
              <div>
                <div className="flex justify-between mb-1 items-center">
                  <div>
                    <div className="font-medium">Minimap</div>
                    <div className="text-sm opacity-70">
                      Show minimap navigation preview.
                    </div>
                  </div>
                  <label className="flex items-center gap-2 select-none">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded ${
                        localSettings.minimap
                          ? "bg-blue-600 border-blue-600"
                          : ""
                      }`}
                      style={{
                        borderColor: palette.border,
                      }}
                      onClick={() =>
                        handleChange("minimap", !localSettings.minimap)
                      }
                    >
                      {localSettings.minimap && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span>Enabled</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Files Section */}
        <div
          className="mb-4 border rounded-md overflow-hidden"
          style={{ borderColor: palette.border }}
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            style={{ background: palette.sidebarBackground }}
            onClick={() => toggleSection("files")}
          >
            <div className="flex items-center">
              <span className="mr-2">📄</span>
              <span>Files</span>
            </div>
            {openSection === "files" ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>

          {openSection === "files" && (
            <div
              className="p-4 space-y-6"
              style={{ background: palette.editorBackground }}
            >
              {/* Auto Save */}
              <div>
                <div className="flex justify-between mb-1 items-center">
                  <div>
                    <div className="font-medium">Auto Save</div>
                    <div className="text-sm opacity-70">
                      Controls auto save of editors.
                    </div>
                  </div>
                  <label className="flex items-center gap-2 select-none">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded ${
                        localSettings.autoSave
                          ? "bg-blue-600 border-blue-600"
                          : ""
                      }`}
                      style={{
                        borderColor: palette.border,
                      }}
                      onClick={() =>
                        handleChange("autoSave", !localSettings.autoSave)
                      }
                    >
                      {localSettings.autoSave && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span>Enabled</span>
                  </label>
                </div>
              </div>

              {/* Auto Save Delay */}
              {localSettings.autoSave && (
                <div>
                  <div className="flex justify-between mb-1">
                    <div>
                      <div className="font-medium">Auto Save Delay</div>
                      <div className="text-sm opacity-70">
                        Controls the delay in ms after which an editor is saved
                        automatically.
                      </div>
                    </div>
                    <input
                      type="number"
                      value={localSettings.autoSaveDelay}
                      onChange={(e) =>
                        handleChange("autoSaveDelay", Number(e.target.value))
                      }
                      className="w-32 px-2 py-1 rounded"
                      style={{
                        background: palette.gutterBackground,
                        color: palette.editorForeground,
                        border: `1px solid ${palette.border}`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Appearance Section */}
        <div
          className="mb-4 border rounded-md overflow-hidden"
          style={{ borderColor: palette.border }}
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            style={{ background: palette.sidebarBackground }}
            onClick={() => toggleSection("appearance")}
          >
            <div className="flex items-center">
              <span className="mr-2">🎨</span>
              <span>Appearance</span>
            </div>
            {openSection === "appearance" ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>

          {openSection === "appearance" && (
            <div
              className="p-4 space-y-6"
              style={{ background: palette.editorBackground }}
            >
              {/* Theme */}
              <div>
                <div className="flex justify-between mb-1">
                  <div>
                    <div className="font-medium">Color Theme</div>
                    <div className="text-sm opacity-70">
                      Specifies the color theme used in the workbench.
                    </div>
                  </div>
                  <div className="relative w-32">
                    <select
                      className="w-full appearance-none px-2 py-1 pr-8 rounded"
                      style={{
                        background: palette.gutterBackground,
                        color: palette.editorForeground,
                        border: `1px solid ${palette.border}`,
                      }}
                      value={localSettings.theme}
                      onChange={(e) => handleChange("theme", e.target.value)}
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Font Sizes */}
              <div>
                <div className="font-medium mb-2">Font Sizes</div>

                {/* Navbar Font Size */}
                <div className="flex justify-between mb-3 pl-4">
                  <div>
                    <div className="text-sm">Navbar</div>
                  </div>
                  <input
                    type="number"
                    value={localSettings.fontSizes.navbar}
                    onChange={(e) =>
                      handleFontSizeChange("navbar", e.target.value)
                    }
                    className="w-32 px-2 py-1 rounded"
                    style={{
                      background: palette.gutterBackground,
                      color: palette.editorForeground,
                      border: `1px solid ${palette.border}`,
                    }}
                  />
                </div>

                {/* Browser Font Size */}
                <div className="flex justify-between mb-3 pl-4">
                  <div>
                    <div className="text-sm">File Browser</div>
                  </div>
                  <input
                    type="number"
                    value={localSettings.fontSizes.browser}
                    onChange={(e) =>
                      handleFontSizeChange("browser", e.target.value)
                    }
                    className="w-32 px-2 py-1 rounded"
                    style={{
                      background: palette.gutterBackground,
                      color: palette.editorForeground,
                      border: `1px solid ${palette.border}`,
                    }}
                  />
                </div>

                {/* Terminal Font Size */}
                <div className="flex justify-between mb-3 pl-4">
                  <div>
                    <div className="text-sm">Terminal</div>
                  </div>
                  <input
                    type="number"
                    value={localSettings.fontSizes.terminal}
                    onChange={(e) =>
                      handleFontSizeChange("terminal", e.target.value)
                    }
                    className="w-32 px-2 py-1 rounded"
                    style={{
                      background: palette.gutterBackground,
                      color: palette.editorForeground,
                      border: `1px solid ${palette.border}`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* C++ Configuration Section */}
        <div
          className="mb-4 border rounded-md overflow-hidden"
          style={{ borderColor: palette.border }}
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            style={{ background: palette.sidebarBackground }}
            onClick={() => toggleSection("cpp")}
          >
            <div className="flex items-center">
              <span className="mr-2">⚙️</span>
              <span>C++ Configuration</span>
            </div>
            {openSection === "cpp" ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>

          {openSection === "cpp" && (
            <div
              className="p-4 space-y-6"
              style={{ background: palette.editorBackground }}
            >
              {/* Max Runtime */}
              <div>
                <div className="flex justify-between mb-1">
                  <div>
                    <div className="font-medium">Max Runtime (s)</div>
                    <div className="text-sm opacity-70">
                      Maximum execution time for C++ programs in seconds.
                    </div>
                  </div>
                  <input
                    type="number"
                    value={localSettings.maxRuntime}
                    onChange={(e) =>
                      handleChange("maxRuntime", Number(e.target.value))
                    }
                    className="w-32 px-2 py-1 rounded"
                    style={{
                      background: palette.gutterBackground,
                      color: palette.editorForeground,
                      border: `1px solid ${palette.border}`,
                    }}
                  />
                </div>
              </div>

              {/* C++ Flags */}
              <div>
                <div className="mb-1">
                  <div className="font-medium">Environment Flags (JSON)</div>
                  <div className="text-sm opacity-70">
                    Configure C++ compilation flags as JSON.
                  </div>
                </div>
                <textarea
                  value={JSON.stringify(localSettings.cppFlags, null, 2)}
                  onChange={(e) => handleChange("cppFlags", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded"
                  style={{
                    background: palette.gutterBackground,
                    color: palette.editorForeground,
                    border: `1px solid ${palette.border}`,
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8">
          {showSaved && (
            <div
              className="mb-3 px-4 py-2 rounded text-sm font-medium shadow transition-opacity duration-200"
              style={{
                background: palette.successForeground || "#1BFD56",
                color: palette.sidebarBackground,
                opacity: showSaved ? 1 : 0,
              }}
            >
              Settings saved!
            </div>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded cursor-pointer hover:to-blue-400"
            style={{
              backgroundColor: palette.navbarBackground,
              color: palette.navbarForeground,
            }}
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
