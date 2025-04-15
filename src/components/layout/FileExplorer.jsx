import { FaChevronRight } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function FileExplorer() {
  const { showFileExplorer } = useEditor();
  
  if (!showFileExplorer) return null;
  
  return (
    <div className="w-56 bg-[#252526] border-r border-[#3c3c3c] flex flex-col">
      <div className="p-2 uppercase text-xs font-semibold tracking-wider text-gray-400">
        Explorer
      </div>

      {/* Project folder structure */}
      <div className="p-2">
        <div className="flex items-center group cursor-pointer">
          <FaChevronRight className="w-3 h-3 mr-1 text-gray-400 transform rotate-90" />
          <span className="ml-1 text-sm">C++ PROJECT</span>
        </div>

        <div className="ml-4 mt-1">
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1 bg-[#37373d]">
            <span className="text-white">main.cpp</span>
          </div>
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1">
            <span className="text-gray-300">input.txt</span>
          </div>
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1">
            <span className="text-gray-300">output.txt</span>
          </div>
        </div>
      </div>

      {/* OPEN EDITORS section */}
      <div className="mt-4 p-2">
        <div className="flex items-center group cursor-pointer">
          <FaChevronRight className="w-3 h-3 mr-1 text-gray-400 transform rotate-90" />
          <span className="text-xs uppercase tracking-wider text-gray-400">
            Open Editors
          </span>
        </div>

        <div className="ml-4 mt-1">
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1 bg-[#37373d]">
            <span className="text-white">main.cpp</span>
          </div>
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1">
            <span className="text-gray-300">input.txt</span>
          </div>
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1">
            <span className="text-gray-300">output.txt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
