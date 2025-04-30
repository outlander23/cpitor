import React, { useMemo, useCallback, Suspense } from "react";
import { EditorProvider, useEditor } from "./context/EditorContext";
import TitleBar from "./components/layout/TitleBar";
import ActivityBar from "./components/layout/ActivityBar";
import FileExplorer from "./components/layout/FileExplorer";
import CodeEditor from "./components/editor/CodeEditor";
import Terminal from "./components/layout/Terminal";
import InputOutputPanel from "./components/editor/InputOutputPanel";
import NoCodeScreen from "./components/editor/NoCodeScreen";

// Lazy load rarely-used pages
const SettingsPage = React.lazy(() => import("./components/settings/settings"));
const HomePage = React.lazy(() => import("./components/home/home"));

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

// Memoize heavy components if needed
const MemoizedFileExplorer = React.memo(FileExplorer);
const MemoizedCodeEditor = React.memo(CodeEditor);
const MemoizedTerminal = React.memo(Terminal);
const MemoizedInputOutputPanel = React.memo(InputOutputPanel);
const MemoizedNoCodeScreen = React.memo(NoCodeScreen);

function AppContent() {
  const { showFileExplorer, activeView, settings, openFiles, isDirOpen } =
    useEditor();
  const palette = settings.themeColors[settings.theme];

  // Memoize style objects
  const handleStyleHorizontal = useMemo(
    () => ({ backgroundColor: palette.border }),
    [palette.border]
  );
  const handleStyleVertical = useMemo(
    () => ({ backgroundColor: palette.border }),
    [palette.border]
  );

  // Memoize resize handle rendering
  const renderResizableHandle = useCallback(
    (direction = "horizontal") => (
      <ResizableHandle
        className={
          `transition-colors duration-150 z-10 ` +
          (direction === "horizontal" ? "w-[3px]" : "h-[3px]") +
          ` cursor-${direction === "horizontal" ? "col-resize" : "row-resize"}`
        }
        style={
          direction === "horizontal"
            ? handleStyleHorizontal
            : handleStyleVertical
        }
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = palette.borderHover)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = palette.border)
        }
      />
    ),
    [palette.borderHover, handleStyleHorizontal, handleStyleVertical]
  );

  // Memoize main content rendering for performance
  const renderMainContent = useCallback(() => {
    if (activeView === "home")
      return (
        <Suspense fallback={<div>Loading Home…</div>}>
          <HomePage />
        </Suspense>
      );
    if (activeView === "settings")
      return (
        <Suspense fallback={<div>Loading Settings…</div>}>
          <SettingsPage />
        </Suspense>
      );

    if (activeView === "editor") {
      if (openFiles.length === 0) {
        return (
          <ResizablePanelGroup
            direction="horizontal"
            className="flex h-full w-full"
          >
            {showFileExplorer && isDirOpen && (
              <>
                <ResizablePanel
                  defaultSize={12}
                  minSize={12}
                  maxSize={30}
                  className="overflow-auto"
                  style={{
                    borderRight: `1px solid ${palette.border}`,
                    minWidth: 0,
                  }}
                >
                  <MemoizedFileExplorer />
                </ResizablePanel>
                {renderResizableHandle()}
              </>
            )}
            <ResizablePanel
              className="overflow-auto flex-1"
              style={{ minWidth: 0 }}
            >
              <MemoizedNoCodeScreen />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      }

      return (
        <ResizablePanelGroup
          direction="horizontal"
          className="flex h-full w-full"
        >
          {showFileExplorer && isDirOpen && (
            <>
              <ResizablePanel
                defaultSize={12}
                minSize={12}
                maxSize={30}
                className="overflow-auto"
                style={{
                  borderRight: `1px solid ${palette.border}`,
                  minWidth: 0,
                }}
              >
                <MemoizedFileExplorer />
              </ResizablePanel>
              {renderResizableHandle()}
            </>
          )}

          <ResizablePanel defaultSize={60} minSize={30} style={{ minWidth: 0 }}>
            <ResizablePanelGroup
              direction="vertical"
              className="flex h-full w-full"
            >
              <ResizablePanel
                defaultSize={85}
                minSize={20}
                style={{
                  borderBottom: `1px solid ${palette.border}`,
                  minHeight: 0,
                }}
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

          {renderResizableHandle()}
          <ResizablePanel
            defaultSize={20}
            minSize={10}
            style={{ borderLeft: `1px solid ${palette.border}`, minWidth: 0 }}
          >
            <MemoizedInputOutputPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    }

    // fallback
    return (
      <Suspense fallback={<div>Loading Home…</div>}>
        <HomePage />
      </Suspense>
    );
  }, [
    activeView,
    showFileExplorer,
    isDirOpen,
    openFiles.length,
    palette.border,
    renderResizableHandle,
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
