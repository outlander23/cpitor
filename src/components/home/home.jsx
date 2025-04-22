import React from "react";
import { FaCode, FaLaptopCode, FaFileCode } from "react-icons/fa";
import { useEditor } from "../../context/EditorContext";

const HomePage = () => {
  const { openFileFromLoadscreen } = useEditor();

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white px-6 py-10 overflow-auto">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-white">
            🚀 Welcome to C++ Editor
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            A powerful, modern editor for all your C++ development needs.
          </p>
        </header>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          {/* Start Coding Card */}
          <FeatureCard
            icon={<FaCode className="text-blue-400 text-3xl" />}
            title="Start Coding"
            description="Write modern C++ code with IntelliSense, syntax highlighting, and live editing."
            actionLabel="Open File"
            onAction={openFileFromLoadscreen}
          />

          {/* Recent Projects Card */}
          <FeatureCard
            icon={<FaLaptopCode className="text-green-400 text-3xl" />}
            title="Recent Projects"
            description="Quickly resume your recent work and projects with one click."
            footer={
              <div className="text-gray-500 italic mt-2">
                No recent projects
              </div>
            }
          />
        </div>

        {/* Getting Started */}
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  footer,
}) => (
  <div className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-200">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
    <p className="text-gray-400 mb-4">{description}</p>
    {actionLabel && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
      >
        {actionLabel}
      </button>
    )}
    {footer}
  </div>
);

export default HomePage;
