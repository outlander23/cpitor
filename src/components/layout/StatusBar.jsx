import { FaCodeBranch, FaTerminal } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function StatusBar() {
  const { currentUser, currentDateTime } = useEditor();
  
  return (
    <div className="h-5 bg-[#007acc] flex items-center px-2 text-xs justify-between text-white">
      <div className="flex items-center space-x-3">
        <span className="flex items-center space-x-1">
          <FaCodeBranch className="text-xs" />
          <span>main</span>
        </span>
        <span>
          <FaTerminal className="inline mr-1 text-xs" />
          <span>Problem</span>
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <span>{currentUser}</span>
        <span>{currentDateTime}</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span>C++</span>
        <span>Ln 3, Col 3</span>
      </div>
    </div>
  );
}
