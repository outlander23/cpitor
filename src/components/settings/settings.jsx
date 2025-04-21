import React, { useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { Settings, Save } from "lucide-react";

const SettingsPage = () => {
  const { settings, updateSettings } = useEditor();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (key, value) => {
    if (key === "cppEnvVars") {
      try {
        const parsed = JSON.parse(value);
        setLocalSettings((prev) => ({ ...prev, [key]: parsed }));
      } catch (error) {
        console.error("Invalid JSON for environment variables");
      }
    } else {
      setLocalSettings((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleFontSizeChange = (component, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      fontSizes: { ...prev.fontSizes, [component]: Number(value) },
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-gray-100 font-mono">
      {/* Sidebar */}
      <aside className="w-64 bg-[#252526] border-r border-[#333] p-4">
        <div className="flex items-center gap-2 mb-6 text-lg font-bold text-white">
          <Settings size={20} />
          Settings
        </div>
        <nav className="space-y-2 text-sm">
          <div className="text-gray-300 hover:text-white cursor-pointer">
            General
          </div>
          <div className="text-gray-300 hover:text-white cursor-pointer">
            Font Sizes
          </div>
          <div className="text-gray-300 hover:text-white cursor-pointer">
            C++ Config
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Editor Settings</h2>

        <div className="space-y-6">
          {/* Theme */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Theme
            </label>
            <div className="flex flex-row items-center space-x-6 pl-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-400"
                  name="theme"
                  value="light"
                  checked={localSettings.theme === "light"}
                  onChange={(e) => handleChange("theme", e.target.value)}
                />
                <span className="ml-2 text-sm text-gray-200">Light</span>
              </label>

              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-400"
                  name="theme"
                  value="dark"
                  checked={localSettings.theme === "dark"}
                  onChange={(e) => handleChange("theme", e.target.value)}
                />
                <span className="ml-2 text-sm text-gray-200">Dark</span>
              </label>
            </div>
          </div>

          {/* Font Sizes */}
          {["navbar", "browser", "terminal", "codeEditor"].map((key) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")} Font Size
              </label>
              <input
                type="number"
                value={localSettings.fontSizes[key]}
                onChange={(e) => handleFontSizeChange(key, e.target.value)}
                className="bg-[#1e1e1e] border border-[#3c3c3c] p-2 w-full rounded focus:outline-none"
              />
            </div>
          ))}

          {/* C++ Runtime */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Runtime for C++
            </label>
            <input
              type="text"
              value={localSettings.runtimeForCPP}
              onChange={(e) => handleChange("runtimeForCPP", e.target.value)}
              className="bg-[#1e1e1e] border border-[#3c3c3c] p-2 w-full rounded focus:outline-none"
            />
          </div>

          {/* C++ Env Vars */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              C++ Environment Variables (JSON)
            </label>
            <textarea
              value={JSON.stringify(localSettings.cppEnvVars, null, 2)}
              onChange={(e) => handleChange("cppEnvVars", e.target.value)}
              className="bg-[#1e1e1e] border border-[#3c3c3c] p-2 w-full rounded focus:outline-none"
              rows="6"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-10 text-right">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-[#0e639c] hover:bg-[#1177bb] text-white font-medium px-4 py-2 rounded"
          >
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
