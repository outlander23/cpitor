import React from "react";
import { FaCode, FaLaptopCode, FaFileCode } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

const HomePage = () => {
  const { openFileFromLoadscreen } = useEditor();

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white p-8">
      <div className="max-w-4xl mx-auto w-full">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">C++ Editor</h1>
          <p className="text-gray-400 text-lg">
            A powerful editor for C++ development
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <div className="flex items-center mb-4">
              <FaCode className="text-blue-400 mr-3 text-2xl" />
              <h2 className="text-xl font-semibold">Start Coding</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Begin writing C++ code with a fully-featured editor that includes
              syntax highlighting and code completion.
            </p>
            <button
              onClick={openFileFromLoadscreen}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Open File
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <div className="flex items-center mb-4">
              <FaLaptopCode className="text-green-400 mr-3 text-2xl" />
              <h2 className="text-xl font-semibold">Recent Projects</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Continue your work where you left off with quick access to your
              recent projects.
            </p>
            <div className="text-gray-500 italic">No recent projects</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FaFileCode className="text-purple-400 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold">Getting Started</h2>
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Open or create a C++ file using the Explorer</li>
            <li>Write your code in the editor</li>
            <li>Compile and run using the terminal</li>
            <li>View output in the terminal or dedicated output panel</li>
            <li>Configure settings to personalize your experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
