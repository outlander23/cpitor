import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEditor } from "../../context/EditorContext";
import { useState } from "react";

export default function TitleBar() {
  const { activeFileName } = useEditor();
  const [fileMenuOpen, setFileMenuOpen] = useState(false);

  return (
    <div className="bg-[#3c3c3c] p-1 flex items-center justify-between text-sm select-none text-white relative">
      <div className="flex space-x-4 relative">
        {/* File Menu */}
        <div
          className="inline-block relative"
          onMouseEnter={() => setFileMenuOpen(true)}
          onMouseLeave={() => setFileMenuOpen(false)}
        >
          <span className="inline-block px-2 hover:bg-gray-700 cursor-default">
            File
          </span>
          {fileMenuOpen && (
            <div className="absolute top-full left-0 bg-[#2e2e2e] w-48 border border-gray-600 shadow-lg z-10">
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                New File
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                Create Folder
              </div>
              <hr className="border-gray-600" />
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                Open File...
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                Save
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                Exit
              </div>
            </div>
          )}
        </div>

        {/* Other Menu Items */}
        {["Edit", "View", "Go", "Run", "Terminal", "Help"].map((item) => (
          <span
            key={item}
            className="inline-block px-2 hover:bg-gray-700 cursor-default"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Center Title */}
      <div className="text-center">{activeFileName} - cpitor</div>

      {/* Window Controls */}
      <div className="flex space-x-1 items-center">
        <div
          onClick={() => getCurrentWindow().minimize()}
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 cursor-pointer group"
        >
          <span className="text-sm text-gray-400 group-hover:text-white">
            _
          </span>
        </div>
        <div
          onClick={() => getCurrentWindow().toggleMaximize()}
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 cursor-pointer group"
        >
          <span className="text-sm text-gray-400 group-hover:text-white">
            □
          </span>
        </div>
        <div
          onClick={() => getCurrentWindow().close()}
          className="w-6 h-6 flex items-center justify-center hover:bg-red-500 cursor-pointer group"
        >
          <span className="text-sm text-gray-400 group-hover:text-white">
            ×
          </span>
        </div>
      </div>
    </div>
  );
}
