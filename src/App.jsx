import { EditorProvider, useEditor } from "./context/EditorContext";
import TitleBar from "./components/layout/TitleBar";
import ActivityBar from "./components/layout/ActivityBar";
import FileExplorer from "./components/layout/FileExplorer";
import CodeEditor from "./components/editor/CodeEditor";
import Terminal from "./components/layout/Terminal";
import InputOutputPanel from "./components/editor/InputOutputPanel";
import SettingsPage from "./components/settings/settings";
import HomePage from "./components/home/home";

function AppContent() {
  const { showFileExplorer, activeView } = useEditor();

  const renderMainContent = () => {
    if (activeView === "home") {
      return <HomePage />;
    }

    if (activeView === "settings") {
      return <SettingsPage />;
    }

    if (activeView === "editor") {
      return (
        <>
          {showFileExplorer && activeView === "editor" && <FileExplorer />}
          <div className="col-span-1 flex h-full">
            {/* Code Editor + Terminal Section */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
              <div className="flex-1 overflow-auto">
                <CodeEditor />
              </div>
              <div className="h-40 overflow-auto border-t border-gray-700">
                <Terminal />
              </div>
            </div>

            {/* Input Output Panel */}
            <div className="w-[400px] h-full overflow-auto border-l border-gray-700">
              <InputOutputPanel />
            </div>
          </div>
        </>
      );
    }

    // Fallback view
    return <HomePage />;
  };

  return (
    <div className="h-screen w-screen bg-[#1e1e1e] text-white font-sans grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Title Bar */}
      <div>
        <TitleBar />
      </div>

      {/* Main Layout */}

      {activeView === "editor" && (
        <div
          className={`grid h-full overflow-hidden ${
            showFileExplorer
              ? "grid-cols-[40px_250px_1fr]"
              : "grid-cols-[40px_1fr]"
          }`}
        >
          <ActivityBar />

          {renderMainContent()}
        </div>
      )}
      {activeView !== "editor" && (
        <div className="flex h-full overflow-hidden">
          <ActivityBar />
          <div className="flex-1">{renderMainContent()}</div>
        </div>
      )}
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
