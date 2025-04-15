import {
  FaFolderOpen,
  FaSearch,
  FaCodeBranch,
  FaBug,
  FaPuzzlePiece,
} from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function ActivityBar() {
  const { showFileExplorer, toggleFileExplorer } = useEditor();
  
  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-6">
      <button
        title="Explorer"
        className={`p-1 ${
          showFileExplorer ? "border-l-2 border-white" : ""
        }`}
        onClick={toggleFileExplorer}
      >
        <FaFolderOpen className="w-5 h-5 text-gray-300" />
      </button>
      <button title="Search" className="p-1">
        <FaSearch className="w-5 h-5 text-gray-400" />
      </button>
      <button title="Source Control" className="p-1">
        <FaCodeBranch className="w-5 h-5 text-gray-400" />
      </button>
      <button title="Run and Debug" className="p-1">
        <FaBug className="w-5 h-5 text-gray-400" />
      </button>
      <button title="Extensions" className="p-1">
        <FaPuzzlePiece className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}
