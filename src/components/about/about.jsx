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
            <div className="text-sm opacity-70">Version 1.0.0</div>
            <div className="text-xs opacity-50">Analysis Fluent Beta</div>
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
            Cpitor is a code analysis tool designed to help developers
            understand and improve their code. It provides a development
            environment with features like static analysis, code metrics, and
            dependency visualization.
          </p>
          <p className="text-sm">
            This tool is designed to be fast, customizable, and user-friendly,
            making it perfect for both beginners and experienced developers.
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
                  href="#"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">📄</span>
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">🐙</span>
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">🐛</span>
                  Report Issue
                </a>
              </li>
              <li>
                <a
                  href="#"
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
                  href="#"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">⚖️</span>
                  License
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm hover:underline"
                  style={{ color: palette.editorForeground }}
                >
                  <span className="mr-2">🔒</span>
                  Privacy Statement
                </a>
              </li>
              <li>
                <a
                  href="#"
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

        {/* System Info */}
        <div
          className="p-4 rounded-lg mb-6"
          style={{
            background: palette.sidebarBackground,
            border: `1px solid ${palette.border}`,
          }}
        >
          <h3 className="text-md font-semibold mb-2">System Info</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-0.5 pr-4 opacity-70">OS</td>
                <td>Windows 10 Pro 64-bit</td>
              </tr>
              <tr>
                <td className="py-0.5 pr-4 opacity-70">Memory (System)</td>
                <td>16.0 GB</td>
              </tr>
              <tr>
                <td className="py-0.5 pr-4 opacity-70">CPU</td>
                <td>Intel Core i7-10700K @ 3.80GHz</td>
              </tr>
              <tr>
                <td className="py-0.5 pr-4 opacity-70">Renderer</td>
                <td>WebKit</td>
              </tr>
              <tr>
                <td className="py-0.5 pr-4 opacity-70">Languages</td>
                <td>JavaScript, TypeScript, HTML, CSS, Vue</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Copyright */}
        <div className="text-center opacity-50 text-xs">
          <p>Copyright © 2025 Cpitor. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
