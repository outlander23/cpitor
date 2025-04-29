import { EditorProvider, useEditor } from "./context/EditorContext";
import TitleBar from "./components/layout/TitleBar";
import ActivityBar from "./components/layout/ActivityBar";
import FileExplorer from "./components/layout/FileExplorer";
import CodeEditor from "./components/editor/CodeEditor";
import Terminal from "./components/layout/Terminal";
import InputOutputPanel from "./components/editor/InputOutputPanel";
import SettingsPage from "./components/settings/settings";
import HomePage from "./components/home/home";
import NoCodeScreen from "./components/editor/NoCodeScreen";

// Import Resizable UI
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
function AppContent() {
  const { showFileExplorer, activeView, settings, openFiles, isDirOpen } =
    useEditor();
  const palette = settings.themeColors[settings.theme];

  const renderResizableHandle = () => (
    <ResizableHandle
      className="transition-colors duration-150"
      style={{
        backgroundColor: palette.border,
        width: "1px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = palette.borderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = palette.border;
      }}
    />
  );

  const renderMainContent = () => {
    if (activeView === "home") return <HomePage />;
    if (activeView === "settings") return <SettingsPage />;

    if (activeView === "editor") {
      // No files open: show FileExplorer + NoCodeScreen
      if (openFiles.length === 0) {
        return (
          <ResizablePanelGroup
            direction="horizontal"
            className="flex h-full w-full"
          >
            {showFileExplorer && isDirOpen && (
              <>
                <ResizablePanel
                  defaultSize={20}
                  minSize={12}
                  maxSize={30}
                  className="overflow-auto"
                  style={{ borderRight: `1px solid ${palette.border}` }}
                >
                  <FileExplorer />
                </ResizablePanel>
                {renderResizableHandle()}
              </>
            )}
            <ResizablePanel className="overflow-auto flex-1">
              <NoCodeScreen />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      }

      // Files open: FileExplorer | Editor/Terminal | I/O Panel
      return (
        <ResizablePanelGroup
          direction="horizontal"
          className="flex h-full w-full"
        >
          {showFileExplorer && isDirOpen && (
            <>
              <ResizablePanel
                defaultSize={20}
                minSize={12}
                maxSize={30}
                className="overflow-auto"
                style={{ borderRight: `1px solid ${palette.border}` }}
              >
                <FileExplorer />
              </ResizablePanel>
              {renderResizableHandle()}
            </>
          )}
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup
              direction="vertical"
              className="flex flex-1 h-full"
            >
              <ResizablePanel
                defaultSize={85}
                minSize={20}
                style={{ borderBottom: `1px solid ${palette.border}` }}
              >
                <CodeEditor />
              </ResizablePanel>
              {renderResizableHandle()}
              <ResizablePanel defaultSize={15} minSize={10}>
                <Terminal />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          {renderResizableHandle()}
          <ResizablePanel
            defaultSize={20}
            minSize={10}
            style={{ borderLeft: `1px solid ${palette.border}` }}
          >
            <InputOutputPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
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
