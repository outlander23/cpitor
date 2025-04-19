import { EditorProvider, useEditor } from "./context/EditorContext";
import TitleBar from "./components/layout/TitleBar";
import ActivityBar from "./components/layout/ActivityBar";
import FileExplorer from "./components/layout/FileExplorer";
import CodeEditor from "./components/editor/CodeEditor";
import Terminal from "./components/layout/Terminal";
import InputOutputPanel from "./components/editor/InputOutputPanel";

function AppContent() {
  const { showFileExplorer } = useEditor();

  return (
    <div className="h-screen w-screen bg-[#1e1e1e] text-white font-sans grid grid-rows-[auto_1fr] overflow-hidden">
      <div className="col-span-full">
        <TitleBar />
      </div>

      <div
        className={`grid ${
          showFileExplorer
            ? "grid-cols-[40px_250px_1fr_200px]"
            : "grid-cols-[40px_1fr_200px]"
        } grid-rows-1 h-full overflow-hidden`}
      >
        <div className="row-span-full bg-[#333333]">
          <ActivityBar />
        </div>
        {showFileExplorer && (
          <div className="row-span-full overflow-y-auto bg-[#1e1e1e] border-r border-gray-700">
            <FileExplorer />
          </div>
        )}
        {/* Editor Area */}
        <div className="row-span-full flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto">
            <CodeEditor />
          </div>

          <div className="h-40 overflow-y-auto border-t border-gray-700">
            <Terminal />
          </div>
        </div>

        <div className="row-span-full border-l border-gray-700 bg-[#1e1e1e]">
          <InputOutputPanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <EditorProvider>
      <AppContent />
    </EditorProvider>
  );
}
