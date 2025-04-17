import { FaTerminal } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function Terminal() {
  const { terminalOutput } = useEditor();

  return (
    <div className="h-32 bg-[#1e1e1e] border-t border-[#3c3c3c] flex flex-col">
      <div className="flex items-center px-2 py-1 bg-[#252526] border-b border-[#3c3c3c]">
        <div className="flex items-center">
          <FaTerminal className="mr-2 text-xs" />
          <span className="text-xs">TERMINAL</span>
        </div>
        <div className="mx-2 text-gray-500">|</div>
        <div className="text-xs text-gray-300">bash</div>
        <button className="ml-auto text-xs text-gray-400 hover:text-white">
          ⋮
        </button>
      </div>
      <div className="flex-grow overflow-auto p-2 font-mono text-sm bg-[#1e1e1e]">
        <pre className="text-gray-300">{terminalOutput}</pre>
      </div>
    </div>
  );
}
