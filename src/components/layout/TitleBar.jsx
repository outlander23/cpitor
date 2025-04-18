import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEditor } from "../../context/EditorContext";

export default function TitleBar() {
  const { fileName } = useEditor();

  return (
    <div className="bg-[#3c3c3c] p-1 flex items-center justify-between text-sm select-none text-white">
      <div className="flex space-x-4">
        <span className="inline-block px-2 hover:bg-gray-700 cursor-default">
          File
        </span>
        <span className="inline-block px-2 hover:bg-gray-700 cursor-default">
          Edit
        </span>
        <span className="inline-block px-2 hover:bg-gray-700 cursor-default">
          View
        </span>
        <span className="inline-block px-2 hover:bg-gray-700 cursor-default">
          Go
        </span>
        <span className="inline-block px-2 hover:bg-gray-700 cursor-default">
          Run
        </span>
        <span className="inline-block px-2 hover:bg-gray-700 cursor-default">
          Terminal
        </span>
        <span className="inline-block px-2 hover:bg-gray-700 cursor-default">
          Help
        </span>
      </div>

      <div className="text-center">{fileName} - cpitor</div>

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
