import React, { useMemo, useCallback, Suspense } from "react";
import { EditorProvider, useEditor } from "./context/EditorContext";
import MenuBar from "./components/layout/MenuBar";
import ActivityBar from "./components/layout/ActivityBar";
import FileExplorer from "./components/layout/FileExplorer";
import CodeEditor from "./components/editor/CodeEditor";
import Terminal from "./components/layout/Terminal";
import InputOutputPanel from "./components/editor/InputOutputPanel";
import TitleBar from "./components/layout/TitleBar";
import NoCodeScreen from "./components/editor/NoCodeScreen";
const SettingsPage = React.lazy(() => import("./components/settings/settings"));
const HomePage = React.lazy(() => import("./components/home/home"));
const AboutPage = React.lazy(() => import("./components/about/about"));

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const MemoizedFileExplorer = React.memo(FileExplorer);
const MemoizedCodeEditor = React.memo(CodeEditor);
const MemoizedTerminal = React.memo(Terminal);
const MemoizedInputOutputPanel = React.memo(InputOutputPanel);
const MemoizedNoCodeScreen = React.memo(NoCodeScreen);

function AppContent() {
  const { showFileExplorer, activeView, settings, openFiles, isDirOpen } =
    useEditor();
  const palette = settings.themeColors[settings.theme];

  // Handles: transparent by default, highlight on hover, thinner to reduce gaps
  const handleStyle = useMemo(() => ({ backgroundColor: "transparent" }), []);
  const renderResizableHandle = useCallback(
    (direction = "horizontal") => (
      <ResizableHandle
        className={`transition-colors duration-150 z-10 ${
          direction === "horizontal"
            ? "w-[1px] h-full cursor-col-resize"
            : "h-[1px] w-full cursor-row-resize"
        }`}
        style={handleStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = palette.borderHover)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      />
    ),
    [palette.borderHover, handleStyle]
  );

  // Helper: wrap main page content in a horizontal resizable group with a permanent explorer panel
  const withExplorer = useCallback(
    (mainPanel) => (
      <ResizablePanelGroup
        direction="horizontal"
        className="flex h-full w-full"
      >
        <ResizablePanel
          defaultSize={showFileExplorer && isDirOpen ? 12 : 0}
          minSize={showFileExplorer && isDirOpen ? 12 : 0}
          maxSize={showFileExplorer && isDirOpen ? 30 : 0}
          className="overflow-auto"
          style={{ minWidth: 0 }}
        >
          {showFileExplorer && isDirOpen && <MemoizedFileExplorer />}
        </ResizablePanel>
        {showFileExplorer && isDirOpen && renderResizableHandle("horizontal")}
        <ResizablePanel
          defaultSize={showFileExplorer && isDirOpen ? 88 : 100}
          minSize={showFileExplorer && isDirOpen ? 40 : 0}
          className="overflow-auto"
          style={{ minWidth: 0 }}
        >
          {mainPanel}
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    [showFileExplorer, isDirOpen, renderResizableHandle]
  );

  // Main content logic
  const renderMainContent = useCallback(() => {
    // Home/About/Settings views
    if (activeView === "home")
      return withExplorer(
        <Suspense fallback={<div>Loading Home…</div>}>
          <HomePage />
        </Suspense>
      );
    if (activeView === "about")
      return withExplorer(
        <Suspense fallback={<div>Loading About…</div>}>
          <AboutPage />
        </Suspense>
      );
    if (activeView === "settings")
      return withExplorer(
        <Suspense fallback={<div>Loading Settings…</div>}>
          <SettingsPage />
        </Suspense>
      );

    // Editor view, but no files open
    if (activeView === "editor" && openFiles.length === 0)
      return withExplorer(<MemoizedNoCodeScreen />);

    // Editor view, with files open
    if (activeView === "editor")
      return (
        <ResizablePanelGroup
          direction="horizontal"
          className="flex h-full w-full"
        >
          <ResizablePanel
            defaultSize={showFileExplorer && isDirOpen ? 12 : 0}
            minSize={showFileExplorer && isDirOpen ? 12 : 0}
            maxSize={showFileExplorer && isDirOpen ? 30 : 0}
            className="overflow-auto"
            style={{ minWidth: 0 }}
          >
            {showFileExplorer && isDirOpen && <MemoizedFileExplorer />}
          </ResizablePanel>
          {showFileExplorer && isDirOpen && renderResizableHandle("horizontal")}
          <ResizablePanel
            defaultSize={showFileExplorer && isDirOpen ? 68 : 80}
            minSize={40}
            style={{ minWidth: 0 }}
          >
            <ResizablePanelGroup
              direction="vertical"
              className="flex h-full w-full"
            >
              <ResizablePanel
                defaultSize={85}
                minSize={20}
                style={{ minHeight: 0 }}
              >
                <MemoizedCodeEditor />
              </ResizablePanel>
              {renderResizableHandle("vertical")}
              <ResizablePanel
                defaultSize={15}
                minSize={10}
                style={{ minHeight: 0 }}
              >
                <MemoizedTerminal />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          {renderResizableHandle("horizontal")}
          <ResizablePanel
            defaultSize={showFileExplorer && isDirOpen ? 20 : 20}
            minSize={15}
            maxSize={40}
            style={{ minWidth: 0 }}
          >
            <MemoizedInputOutputPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    // Fallback
    return (
      <div className="h-full w-full">
        <Suspense fallback={<div>Loading Home…</div>}>
          <HomePage />
        </Suspense>
      </div>
    );
  }, [
    activeView,
    showFileExplorer,
    isDirOpen,
    openFiles.length,
    renderResizableHandle,
    withExplorer,
  ]);

  const containerStyle = useMemo(
    () => ({
      backgroundColor: palette.editorBackground,
      color: palette.editorForeground,
    }),
    [palette.editorBackground, palette.editorForeground]
  );

  return (
    <div
      className="h-screen w-screen font-sans flex flex-col overflow-hidden"
      style={containerStyle}
    >
      <MenuBar />
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
