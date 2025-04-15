#!/bin/bash

# Create directory structure
mkdir -p src/components/layout
mkdir -p src/components/editor
mkdir -p src/context

# Create EditorContext.jsx
cat > src/context/EditorContext.jsx << 'EOL'
import { createContext, useState, useContext } from "react";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  // Application state
  const [fileName, setFileName] = useState("main.cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(
    "// Start coding in C/C++\n\nint main() {\n  // Your code here\n  return 0;\n}"
  );
  const [inputContent, setInputContent] = useState("// Test input data\n5\n10 20 30 40 50");
  const [outputContent, setOutputContent] = useState(
    "// Program output\nSum: 150\nAverage: 30.0"
  );
  const [terminalOutput, setTerminalOutput] = useState(
    "$ g++ -o main main.cpp\n$ ./main\nSum: 150\nAverage: 30.0\n$ _"
  );
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [currentUser] = useState("outlander23");
  const [currentDateTime] = useState("2025-04-14 19:38:05");

  // Handler functions
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const toggleFileExplorer = () => {
    setShowFileExplorer(prev => !prev);
  };

  const runCode = () => {
    setTerminalOutput("$ g++ -o main main.cpp\n$ ./main\nProcessing input...\nSum: 150\nAverage: 30.0\n$ _");
    setOutputContent("// Program output\nSum: 150\nAverage: 30.0");
  };

  return (
    <EditorContext.Provider
      value={{
        fileName,
        setFileName,
        theme,
        setTheme,
        code,
        setCode,
        handleCodeChange,
        inputContent,
        setInputContent,
        outputContent,
        setOutputContent,
        terminalOutput,
        setTerminalOutput,
        showFileExplorer,
        toggleFileExplorer,
        currentUser,
        currentDateTime,
        runCode
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
EOL

# Create TitleBar.jsx
cat > src/components/layout/TitleBar.jsx << 'EOL'
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
EOL

# Create ActivityBar.jsx
cat > src/components/layout/ActivityBar.jsx << 'EOL'
import {
  FaFolderOpen,
  FaSearch,
  FaCodeBranch,
  FaBug,
  FaPuzzlePiece,
} from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function ActivityBar() {
  const { showFileExplorer, toggleFileExplorer } = useEditor();
  
  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-6">
      <button
        title="Explorer"
        className={`p-1 ${
          showFileExplorer ? "border-l-2 border-white" : ""
        }`}
        onClick={toggleFileExplorer}
      >
        <FaFolderOpen className="w-5 h-5 text-gray-300" />
      </button>
      <button title="Search" className="p-1">
        <FaSearch className="w-5 h-5 text-gray-400" />
      </button>
      <button title="Source Control" className="p-1">
        <FaCodeBranch className="w-5 h-5 text-gray-400" />
      </button>
      <button title="Run and Debug" className="p-1">
        <FaBug className="w-5 h-5 text-gray-400" />
      </button>
      <button title="Extensions" className="p-1">
        <FaPuzzlePiece className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}
EOL

# Create FileExplorer.jsx
cat > src/components/layout/FileExplorer.jsx << 'EOL'
import { FaChevronRight } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function FileExplorer() {
  const { showFileExplorer } = useEditor();
  
  if (!showFileExplorer) return null;
  
  return (
    <div className="w-56 bg-[#252526] border-r border-[#3c3c3c] flex flex-col">
      <div className="p-2 uppercase text-xs font-semibold tracking-wider text-gray-400">
        Explorer
      </div>

      {/* Project folder structure */}
      <div className="p-2">
        <div className="flex items-center group cursor-pointer">
          <FaChevronRight className="w-3 h-3 mr-1 text-gray-400 transform rotate-90" />
          <span className="ml-1 text-sm">C++ PROJECT</span>
        </div>

        <div className="ml-4 mt-1">
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1 bg-[#37373d]">
            <span className="text-white">main.cpp</span>
          </div>
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1">
            <span className="text-gray-300">input.txt</span>
          </div>
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1">
            <span className="text-gray-300">output.txt</span>
          </div>
        </div>
      </div>

      {/* OPEN EDITORS section */}
      <div className="mt-4 p-2">
        <div className="flex items-center group cursor-pointer">
          <FaChevronRight className="w-3 h-3 mr-1 text-gray-400 transform rotate-90" />
          <span className="text-xs uppercase tracking-wider text-gray-400">
            Open Editors
          </span>
        </div>

        <div className="ml-4 mt-1">
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1 bg-[#37373d]">
            <span className="text-white">main.cpp</span>
          </div>
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1">
            <span className="text-gray-300">input.txt</span>
          </div>
          <div className="flex items-center text-sm py-1 cursor-pointer hover:bg-[#2a2d2e] px-1">
            <span className="text-gray-300">output.txt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
EOL

# Create EditorTabs.jsx
cat > src/components/layout/EditorTabs.jsx << 'EOL'
import { FaSave, FaPlay } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

export default function EditorTabs() {
  const { fileName, runCode } = useEditor();
  
  return (
    <>
      <div className="bg-[#252526] h-9 flex items-center border-b border-[#3c3c3c]">
        <div className="h-full px-3 flex items-center bg-[#1e1e1e] border-r border-[#3c3c3c] text-sm">
          {fileName}
        </div>
        <div className="flex-grow"></div>
      </div>

      <div className="h-6 bg-[#252526] flex items-center px-4 text-xs">
        <span className="text-gray-300">C++ PROJECT &gt; {fileName}</span>
        <div className="flex-grow"></div>
        <div className="flex space-x-3">
          <FaSave
            className="text-gray-400 cursor-pointer hover:text-white"
            title="Save"
          />
          <FaPlay
            className="text-gray-400 cursor-pointer hover:text-white"
            title="Run"
            onClick={runCode}
          />
        </div>
      </div>
    </>
  );
}
EOL

# Create CodeEditor.jsx
cat > src/components/editor/CodeEditor.jsx << 'EOL'
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

export default function CodeEditor() {
  const { code, handleCodeChange, theme } = useEditor();
  
  return (
    <div className="flex-grow">
      <Editor
        height="100%"
        defaultLanguage="cpp"
        language="cpp"
        value={code}
        onChange={handleCodeChange}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily:
            "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
          automaticLayout: true,
          lineNumbers: "on",
          rulers: [],
          bracketPairColorization: true,
          renderLineHighlight: "line",
          wordWrap: "on",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
        }}
        theme={theme}
      />
    </div>
  );
}
EOL

# Create Terminal.jsx
cat > src/components/layout/Terminal.jsx << 'EOL'
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
EOL

# Create StatusBar.jsx
cat > src/components/layout/StatusBar.jsx << 'EOL'
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
EOL

# Create InputOutputPanel.jsx
cat > src/components/editor/InputOutputPanel.jsx << 'EOL'
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/EditorContext";

export default function InputOutputPanel() {
  const { 
    inputContent, 
    setInputContent, 
    outputContent, 
    theme 
  } = useEditor();
  
  return (
    <div className="w-60 bg-[#252526] flex flex-col border-l border-[#3c3c3c]">
      {/* Input Section - Top */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center px-2 py-1 bg-[#252526] border-b border-[#3c3c3c]">
          <span className="text-xs font-medium">input.txt</span>
        </div>
        <div className="flex-grow">
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            language="plaintext"
            value={inputContent}
            onChange={setInputContent}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily:
                "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
              automaticLayout: true,
              wordWrap: "on",
              glyphMargin: false,
              folding: false,
              rulers: [],
            }}
            theme={theme}
          />
        </div>
      </div>

      {/* Divider between input and output */}
      <div className="border-t border-[#3c3c3c]"></div>

      {/* Output Section - Bottom */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center px-2 py-1 bg-[#252526] border-b border-[#3c3c3c]">
          <span className="text-xs font-medium">output.txt</span>
        </div>
        <div className="flex-grow">
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            language="plaintext"
            value={outputContent}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily:
                "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
              automaticLayout: true,
              wordWrap: "on",
              glyphMargin: false,
              folding: false,
              readOnly: true,
              rulers: [],
            }}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
EOL

# Create the main App.jsx
cat > src/App.jsx << 'EOL'
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
EOL

echo "✅ Project structure and component files have been created successfully!"
echo "
Directory structure created:
src/
├── App.jsx                  # Main application container
├── components/
│   ├── layout/
│   │   ├── TitleBar.jsx     # Top menu bar
│   │   ├── ActivityBar.jsx  # Left sidebar with icons
│   │   ├── FileExplorer.jsx # File tree view
│   │   ├── EditorTabs.jsx   # Editor tabs and breadcrumbs
│   │   ├── Terminal.jsx     # Terminal output panel
│   │   └── StatusBar.jsx    # Bottom status bar
│   └── editor/
│       ├── CodeEditor.jsx   # Main code editor
│       └── InputOutputPanel.jsx # Right panel with input/output
└── context/
    └── EditorContext.jsx    # Shared state between components
"