import { FaSave, FaPlay } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function EditorTabs() {
  const { fileName, runCode } = useEditor();
  
  return (
    <>
      <div className="bg-[#252526] h-9 flex items-center border-b border-[#3c3c3c]">
        <div className="h-full px-3 flex items-center bg-[#1e1e1e] border-r border-[#3c3c3c] text-sm">
          {fileName}
        </div>
        <div className="flex-grow"></div>
      </div>

      <div className="h-6 bg-[#252526] flex items-center px-4 text-xs">
        <span className="text-gray-300">C++ PROJECT &gt; {fileName}</span>
        <div className="flex-grow"></div>
        <div className="flex space-x-3">
          <FaSave
            className="text-gray-400 cursor-pointer hover:text-white"
            title="Save"
          />
          <FaPlay
            className="text-gray-400 cursor-pointer hover:text-white"
            title="Run"
            onClick={runCode}
          />
        </div>
      </div>
    </>
  );
}
