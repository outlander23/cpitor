import { EditorProvider } from './context/EditorContext';
import TitleBar from './components/layout/TitleBar';
import ActivityBar from './components/layout/ActivityBar';
import FileExplorer from './components/layout/FileExplorer';
import EditorTabs from './components/layout/EditorTabs';
import CodeEditor from './components/editor/CodeEditor';
import Terminal from './components/layout/Terminal';
import InputOutputPanel from './components/editor/InputOutputPanel';
import StatusBar from './components/layout/StatusBar';

function App() {
  return (
    <EditorProvider>
      <div className="h-screen flex flex-col bg-[#1e1e1e] text-white font-sans">
        <TitleBar />
        
        <div className="flex flex-grow overflow-hidden">
          <ActivityBar />
          <FileExplorer />
          
          <div className="flex flex-col flex-grow">
            <EditorTabs />
            <CodeEditor />
            <Terminal />
          </div>
          
          <InputOutputPanel />
        </div>
        
        <StatusBar />
      </div>
    </EditorProvider>
  );
}

export default App;
