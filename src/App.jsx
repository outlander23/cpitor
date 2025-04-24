import { EditorProvider, useEditor } from "./context/EditorContext";
import TitleBar from "./components/layout/TitleBar";
import ActivityBar from "./components/layout/ActivityBar";
import FileExplorer from "./components/layout/FileExplorer";
import CodeEditor from "./components/editor/CodeEditor";
import Terminal from "./components/layout/Terminal";
import InputOutputPanel from "./components/editor/InputOutputPanel";
import SettingsPage from "./components/settings/settings";
import HomePage from "./components/home/home";
import Split from "react-split";
import NoCodeScreen from "./components/editor/NoCodeScreen";

function AppContent() {
  const { showFileExplorer, activeView, settings, openFiles } = useEditor();
  const palette = settings.themeColors[settings.theme];

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
          {openFiles.length === 0 && (
            <Split
              className="flex h-full"
              sizes={showFileExplorer ? [20, 60] : [0, 80]}
              minSize={showFileExplorer ? [150, 300] : [0, 300]} // Correct usage as you requested
              gutterSize={4}
              direction="horizontal"
              snapOffset={30}
            >
              {showFileExplorer ? (
                <div className="overflow-auto">
                  <FileExplorer />
                </div>
              ) : (
                <div />
              )}
              <NoCodeScreen />
            </Split>
          )}

          {openFiles.length > 0 && (
            <Split
              className="flex h-full"
              sizes={showFileExplorer ? [20, 60, 20] : [0, 80, 20]} // Adjust sizes based on FileExplorer visibility
              minSize={showFileExplorer ? [150, 300, 200] : [0, 300, 200]} // Allow FileExplorer to collapse
              gutterSize={4}
              direction="horizontal"
              snapOffset={30} // Snap FileExplorer closed if dragged near 0
            >
              {showFileExplorer ? (
                <div className="overflow-auto">
                  <FileExplorer />
                </div>
              ) : (
                <div /> // Empty div to maintain Split structure
              )}
              <Split
                className="flex flex-col h-full"
                sizes={[85, 15]}
                minSize={[200, 100]}
                gutterSize={4}
                direction="vertical"
              >
                <div className="overflow-auto">
                  <CodeEditor />
                </div>
                <div className="overflow-auto border-t border-gray-700">
                  <Terminal />
                </div>
              </Split>
              <div className="overflow-auto border-l border-gray-700">
                <InputOutputPanel />
              </div>
            </Split>
          )}
        </>
      );
    }
    return <HomePage />;
  };

  return (
    <div
      className="h-screen w-screen font-sans flex flex-col overflow-hidden"
      style={{
        backgroundColor: palette.editorBackground,
        color: palette.editorForeground,
      }}
    >
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        <div className="flex-1 overflow-hidden">{renderMainContent()}</div>
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
