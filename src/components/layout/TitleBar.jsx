import { useEditor } from "../../context/EditorContext";

export default function TitleBar() {
  const { fileName } = useEditor();
  
  return (
    <div className="bg-[#3c3c3c] p-1 flex items-center justify-between text-sm">
      <div className="flex space-x-4">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Run</span>
        <span>Terminal</span>
        <span>Help</span>
      </div>
      <div>{fileName} - VS Code</div>
      <div className="flex space-x-4">
        <span>_</span>
        <span>□</span>
        <span>×</span>
      </div>
    </div>
  );
}
