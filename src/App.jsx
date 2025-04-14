import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  FaFolderOpen,
  FaPlay,
  FaTerminal,
  FaSearch,
  FaCodeBranch,
  FaBug,
  FaPuzzlePiece,
  FaChevronRight,
  FaSave,
} from "react-icons/fa";

function App() {
  // Current date and user info displayed in status bar
  const currentDateTime = "2025-04-14 19:38:05";
  const currentUser = "outlander23";

  // Just the layout without full functionality
  const [fileName] = useState("main.cpp");
  const [theme] = useState("vs-dark");
  const [code] = useState(
    "// Start coding in C/C++\n\nint main() {\n  // Your code here\n  return 0;\n}"
  );
  const [inputContent] = useState("// Test input data\n5\n10 20 30 40 50");
  const [outputContent] = useState(
    "// Program output\nSum: 150\nAverage: 30.0"
  );
  const [terminalOutput] = useState(
    "$ g++ -o main main.cpp\n$ ./main\nSum: 150\nAverage: 30.0\n$ _"
  );
  const [showFileExplorer, setShowFileExplorer] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white font-sans">
      {/* Title Bar */}
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
        <div>main.cpp - VS Code</div>
        <div className="flex space-x-4">
          <span>_</span>
          <span>□</span>
          <span>×</span>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar (Activity Bar) */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-6">
          <button
            title="Explorer"
            className={`p-1 ${
              showFileExplorer ? "border-l-2 border-white" : ""
            }`}
            onClick={() => setShowFileExplorer(!showFileExplorer)}
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

        {/* Explorer Sidebar (if active) */}
        {showFileExplorer && (
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
        )}

        {/* Center Editor Area */}
        <div className="flex flex-col flex-grow">
          {/* Tabs area */}
          <div className="bg-[#252526] h-9 flex items-center border-b border-[#3c3c3c]">
            <div className="h-full px-3 flex items-center bg-[#1e1e1e] border-r border-[#3c3c3c] text-sm">
              main.cpp
            </div>
            <div className="flex-grow"></div>
          </div>

          {/* Breadcrumbs & buttons */}
          <div className="h-6 bg-[#252526] flex items-center px-4 text-xs">
            <span className="text-gray-300">C++ PROJECT &gt; main.cpp</span>
            <div className="flex-grow"></div>
            <div className="flex space-x-3">
              <FaSave
                className="text-gray-400 cursor-pointer hover:text-white"
                title="Save"
              />
              <FaPlay
                className="text-gray-400 cursor-pointer hover:text-white"
                title="Run"
              />
            </div>
          </div>

          {/* Editor - Removed any settings that might cause divider lines */}
          <div className="flex-grow">
            <Editor
              height="100%"
              defaultLanguage="cpp"
              language="cpp"
              value={code}
              options={{
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily:
                  "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
                automaticLayout: true,
                lineNumbers: "on",
                rulers: [], // Removed ruler at position 80 which was causing the line
                bracketPairColorization: true,
                renderLineHighlight: "line",
                wordWrap: "on",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
              }}
              theme={theme}
            />
          </div>

          {/* Integrated Terminal */}
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
        </div>

        {/* Right Side Panel (Split Input/Output View) */}
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
      </div>

      {/* Status Bar */}
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
    </div>
  );
}

export default App;
