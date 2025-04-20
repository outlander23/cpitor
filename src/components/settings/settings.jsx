import React, { useState } from "react";
import { useEditor } from "../../context/EditorContext";

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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Theme</label>
        <select
          value={localSettings.theme}
          onChange={(e) => handleChange("theme", e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Navbar Font Size
        </label>
        <input
          type="number"
          value={localSettings.fontSizes.navbar}
          onChange={(e) => handleFontSizeChange("navbar", e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Browser Font Size
        </label>
        <input
          type="number"
          value={localSettings.fontSizes.browser}
          onChange={(e) => handleFontSizeChange("browser", e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Terminal Font Size
        </label>
        <input
          type="number"
          value={localSettings.fontSizes.terminal}
          onChange={(e) => handleFontSizeChange("terminal", e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Code Editor Font Size
        </label>
        <input
          type="number"
          value={localSettings.fontSizes.codeEditor}
          onChange={(e) => handleFontSizeChange("codeEditor", e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Runtime for C++
        </label>
        <input
          type="text"
          value={localSettings.runtimeForCPP}
          onChange={(e) => handleChange("runtimeForCPP", e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          C++ Environment Variables (JSON)
        </label>
        <textarea
          value={JSON.stringify(localSettings.cppEnvVars, null, 2)}
          onChange={(e) => handleChange("cppEnvVars", e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          rows="4"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;
