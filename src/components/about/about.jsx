"use client";

import { useEditor } from "@/context/EditorContext";
import logo from "../../assets/logo.png";

export default function AboutPage() {
  const { settings } = useEditor();
  const palette = settings.themeColors[settings.theme];

  return (
    <div
      className="flex flex-1 overflow-auto p-6"
      style={{
        background: palette.editorBackground,
        color: palette.editorForeground,
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* App Info */}
        <div className="flex items-center mb-6">
          <img src={logo} alt="Cpitor Logo" className="w-36 h-36 mr-4" />
          <div>
            <h1 className="text-2xl font-bold mb-1">Cpitor</h1>
            <div className="text-sm opacity-70">Version 0.1.0</div>
            <div className="text-xs opacity-50">
              Competitive Programming Edition
            </div>
          </div>
        </div>

        {/* About Section */}
        <div
          className="p-4 rounded-lg mb-6"
          style={{
            background: palette.sidebarBackground,
            border: `1px solid ${palette.border}`,
          }}
        >
          <h2 className="text-lg font-semibold mb-3">About Cpitor</h2>
          <p className="mb-2 text-sm">
            Cpitor is a lightweight and fast text editor built specifically for
            competitive programmers who code in C++. It offers a clean
            environment optimized for quick coding, debugging, and running
            solutions under tight contest conditions.
          </p>
          <p className="text-sm">
            With features like C++ syntax highlighting, template management, and
            simple build/run integrations, Cpitor helps you stay focused and
            efficient during contests.
          </p>
        </div>

        {/* Resources and Legal Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Resources */}
          <div
            className="p-4 rounded-lg"
            style={{
              background: palette.sidebarBackground,
              border: `1px solid ${palette.border}`,
            }}
          >
            <h3 className="text-md font-semibold mb-2">Resources</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://github.com/outlander23/cpitor/wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">📄</span>
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/outlander23/cpitor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">🐙</span>
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/outlander23/cpitor/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">🐛</span>
                  Report Issue
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/outlander23/cpitor/issues/new?assignees=&labels=enhancement&template=feature_request.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">💡</span>
                  Request Feature
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div
            className="p-4 rounded-lg"
            style={{
              background: palette.sidebarBackground,
              border: `1px solid ${palette.border}`,
            }}
          >
            <h3 className="text-md font-semibold mb-2">Legal</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://github.com/outlander23/cpitor/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">⚖️</span>
                  License
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/outlander23/cpitor/PRIVACY.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">🔒</span>
                  Privacy Statement
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/outlander23/cpitor/TERMS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">📜</span>
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
