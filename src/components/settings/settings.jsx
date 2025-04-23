import React, { useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { Settings as SettingsIcon, Save, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useEditor();
  // use localSettings for preview; palette comes from localSettings.theme
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState("general");
  const palette = settings.themeColors[localSettings.theme];

  const handleChange = (key, value) => {
    if (key === "cppFlags") {
      try {
        setLocalSettings((prev) => ({
          ...prev,
          [key]: JSON.parse(value),
        }));
      } catch {
        // invalid JSON, ignore
      }
    } else {
      setLocalSettings((prev) => ({ ...prev, [key]: value }));
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
    updateSettings(localSettings);
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "fontSizes", label: "Font Sizes" },
    { id: "editor", label: "Editor" },
    { id: "cpp", label: "C++ Config" },
  ];

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{
        backgroundColor: palette.editorBackground,
        color: palette.editorForeground,
      }}
    >
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 w-60 p-4"
        style={{
          backgroundColor: palette.sidebarBackground,
          color: palette.sidebarForeground,
          borderRight: `1px solid ${palette.border}`,
        }}
      >
        <div className="flex items-center mb-6 text-lg font-semibold">
          <SettingsIcon size={18} className="mr-2" />
          Settings
        </div>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center w-full px-3 py-2 rounded-md transition"
                style={{
                  backgroundColor: isActive
                    ? palette.lineHighlight
                    : "transparent",
                  color: isActive
                    ? palette.editorForeground
                    : palette.sidebarForeground,
                }}
              >
                <span className="flex-1 text-sm">{tab.label}</span>
                <ChevronRight size={14} />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Editor Settings</h2>

        {activeTab === "general" && (
          <section className="space-y-6">
            {/* Theme */}
            <div>
              <h3 className="text-lg font-medium mb-2">Theme</h3>
              <div className="flex space-x-6">
                {["light", "dark"].map((t) => (
                  <label
                    key={t}
                    className="inline-flex items-center cursor-pointer"
                    style={{ color: palette.editorForeground }}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={t}
                      checked={localSettings.theme === t}
                      onChange={(e) => handleChange("theme", e.target.value)}
                    />
                    <span className="ml-2 capitalize">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Auto Save */}
            <div>
              <h3 className="text-lg font-medium mb-2">Auto Save</h3>
              <label
                className="inline-flex items-center cursor-pointer"
                style={{ color: palette.editorForeground }}
              >
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => handleChange("autoSave", e.target.checked)}
                />
                <span className="ml-2">Enable auto save</span>
              </label>
              {localSettings.autoSave && (
                <div className="mt-2 flex items-center space-x-2">
                  <label style={{ color: palette.editorForeground }}>
                    Delay (ms):
                  </label>
                  <input
                    type="number"
                    value={localSettings.autoSaveDelay}
                    onChange={(e) =>
                      handleChange("autoSaveDelay", Number(e.target.value))
                    }
                    className="w-24 px-2 py-1 rounded"
                    style={{
                      backgroundColor: palette.gutterBackground,
                      color: palette.editorForeground,
                      border: `1px solid ${palette.border}`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Minimap */}
            <div>
              <h3 className="text-lg font-medium mb-2">Minimap</h3>
              <label
                className="inline-flex items-center cursor-pointer"
                style={{ color: palette.editorForeground }}
              >
                <input
                  type="checkbox"
                  checked={localSettings.minimap}
                  onChange={(e) => handleChange("minimap", e.target.checked)}
                />
                <span className="ml-2">Show minimap</span>
              </label>
            </div>

            {/* Font Family */}
            <div>
              <h3 className="text-lg font-medium mb-2">Font Family</h3>
              <input
                type="text"
                value={localSettings.fontFamily}
                onChange={(e) => handleChange("fontFamily", e.target.value)}
                className="w-full px-3 py-2 rounded"
                style={{
                  backgroundColor: palette.gutterBackground,
                  color: palette.editorForeground,
                  border: `1px solid ${palette.border}`,
                }}
              />
            </div>
          </section>
        )}

        {activeTab === "fontSizes" && (
          <section className="space-y-4">
            <h3 className="text-lg font-medium">Font Sizes</h3>
            {Object.entries(localSettings.fontSizes).map(([key, size]) => (
              <div key={key} className="flex items-center space-x-4">
                <label
                  className="w-40 capitalize"
                  style={{ color: palette.editorForeground }}
                >
                  {key}:
                </label>
                <input
                  type="number"
                  value={size}
                  onChange={(e) => handleFontSizeChange(key, e.target.value)}
                  className="w-20 px-2 py-1 rounded"
                  style={{
                    backgroundColor: palette.gutterBackground,
                    color: palette.editorForeground,
                    border: `1px solid ${palette.border}`,
                  }}
                />
              </div>
            ))}
          </section>
        )}

        {activeTab === "editor" && (
          <section className="space-y-4">
            <h3 className="text-lg font-medium ">Editor Behavior</h3>
            {[
              { key: "formatOnType", label: "Format on Type" },
              { key: "formatOnPaste", label: "Format on Paste" },
              {
                key: "bracketPairColorization",
                label: "Bracket Pair Colorization",
              },
              { key: "codeFolding", label: "Code Folding" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="inline-flex items-center cursor-pointer space-x-2 p-2 rounded"
                style={{ color: palette.editorForeground }}
              >
                <input
                  type="checkbox"
                  checked={localSettings[key]}
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </section>
        )}

        {activeTab === "cpp" && (
          <section className="space-y-6">
            <h3 className="text-lg font-medium">C++ Runtime & Flags</h3>
            <div>
              <label
                className="block mb-1"
                style={{ color: palette.editorForeground }}
              >
                Max Runtime (s)
              </label>
              <input
                type="number"
                value={localSettings.maxRuntime}
                onChange={(e) =>
                  handleChange("maxRuntime", Number(e.target.value))
                }
                className="w-24 px-2 py-1 rounded"
                style={{
                  backgroundColor: palette.gutterBackground,
                  color: palette.editorForeground,
                  border: `1px solid ${palette.border}`,
                }}
              />
            </div>
            <div>
              <label
                className="block mb-1"
                style={{ color: palette.editorForeground }}
              >
                Environment Flags (JSON)
              </label>
              <textarea
                value={JSON.stringify(localSettings.cppFlags, null, 2)}
                onChange={(e) => handleChange("cppFlags", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded"
                style={{
                  backgroundColor: palette.gutterBackground,
                  color: palette.editorForeground,
                  border: `1px solid ${palette.border}`,
                }}
              />
            </div>
          </section>
        )}

        {/* Save Button */}
        <div className="pt-6 border-t" style={{ borderColor: palette.border }}>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 rounded font-medium transition"
            style={{
              backgroundColor: palette.navbarBackground,
              color: palette.navbarForeground,
            }}
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
