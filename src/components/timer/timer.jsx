"use client";

import { useEffect, useState } from "react";
import { Clock, Play, Pause, RotateCcw, X, GripHorizontal } from "lucide-react";
import { useEditor } from "@/context/EditorContext";

export default function TimerFloatingWindow() {
  // Use timer state from context!
  const {
    settings,
    theme,
    timerValue,
    timerActive,
    startTimer,
    stopTimer,
    resetTimer,
    toggleTimerFloating,
  } = useEditor();

  // Drag logic (local only)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPos, setWindowPos] = useState({
    x: typeof window !== "undefined" ? window.innerWidth - 280 - 24 : 100,
    y: 24,
  });
  const [dragging, setDragging] = useState(false);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragOffset({
      x: e.clientX - windowPos.x,
      y: e.clientY - windowPos.y,
    });
    document.body.style.userSelect = "none";
  };

  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    setWindowPos({
      x: Math.max(
        0,
        Math.min(window.innerWidth - 280, e.clientX - dragOffset.x)
      ),
      y: Math.max(
        0,
        Math.min(window.innerHeight - 180, e.clientY - dragOffset.y)
      ),
    });
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, dragOffset]);

  // Time formatting
  const pad = (n) => String(n).padStart(2, "0");
  const hours = Math.floor(timerValue / 3600);
  const minutes = Math.floor((timerValue % 3600) / 60);
  const seconds = timerValue % 60;

  // Theme colors
  const currentTheme = theme || settings.theme || "dark";
  const colors = settings.themeColors
    ? settings.themeColors[currentTheme]
    : {
        // fallback
        sidebarBackground: "#222",
        border: "#333",
        navbarBackground: "#181818",
        navbarForeground: "#fff",
        editorForeground: "#fff",
      };

  return (
    <div
      className="fixed z-50 rounded-lg shadow-lg overflow-hidden"
      style={{
        left: windowPos.x,
        top: windowPos.y,
        width: 280,
        background: colors.sidebarBackground,
        border: `1px solid ${colors.border}`,
        cursor: dragging ? "grabbing" : "default",
        transition: dragging ? "none" : "box-shadow 0.2s, transform 0.1s",
        boxShadow: dragging
          ? `0 8px 24px rgba(0, 0, 0, ${
              currentTheme === "dark" ? "0.5" : "0.2"
            })`
          : `0 4px 16px rgba(0, 0, 0, ${
              currentTheme === "dark" ? "0.4" : "0.1"
            })`,
        transform: dragging ? "scale(1.02)" : "scale(1)",
      }}
    >
      {/* Header/Drag Handle */}
      <div
        onMouseDown={onMouseDown}
        className="flex items-center justify-between px-3 py-2 select-none cursor-grab"
        style={{
          background: colors.navbarBackground,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal size={14} className="opacity-60" />
          <div className="flex items-center gap-1.5">
            <Clock size={14} style={{ color: colors.navbarForeground }} />
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: colors.navbarForeground }}
            >
              CODING TIME
            </span>
          </div>
        </div>
        <button
          onClick={toggleTimerFloating}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-opacity-80 transition-colors"
          style={{
            color: colors.navbarForeground,
            background:
              currentTheme === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
          }}
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Timer display */}
      <div className="flex flex-col items-center py-4 px-4">
        <div
          className="w-full mb-4 py-3 rounded-md flex items-center justify-center"
          style={{
            background:
              currentTheme === "dark"
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.03)",
            boxShadow: `inset 0 1px 3px rgba(0, 0, 0, ${
              currentTheme === "dark" ? "0.3" : "0.1"
            })`,
          }}
        >
          <div className="flex items-center">
            <TimeUnit
              value={pad(hours)}
              label="h"
              theme={currentTheme}
              colors={colors}
            />
            <span
              className="mx-1 text-2xl"
              style={{ color: colors.editorForeground }}
            >
              :
            </span>
            <TimeUnit
              value={pad(minutes)}
              label="m"
              theme={currentTheme}
              colors={colors}
            />
            <span
              className="mx-1 text-2xl"
              style={{ color: colors.editorForeground }}
            >
              :
            </span>
            <TimeUnit
              value={pad(seconds)}
              label="s"
              theme={currentTheme}
              colors={colors}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <TimerButton
            onClick={timerActive ? stopTimer : startTimer}
            icon={timerActive ? <Pause size={14} /> : <Play size={14} />}
            label={timerActive ? "Pause" : "Start"}
            primary={!timerActive}
            warning={timerActive}
            theme={currentTheme}
            flex={2}
          />
          <TimerButton
            onClick={resetTimer}
            icon={<RotateCcw size={14} />}
            label="Reset"
            danger={true}
            theme={currentTheme}
            flex={1}
          />
        </div>

        {/* Status */}
        <div
          className="mt-3 text-xs w-full text-center py-1 rounded"
          style={{
            color: timerActive
              ? currentTheme === "dark"
                ? "#4ec9b0"
                : "#388e3c"
              : currentTheme === "dark"
              ? "#959595"
              : "#777777",
            background: timerActive
              ? currentTheme === "dark"
                ? "rgba(78, 201, 176, 0.1)"
                : "rgba(56, 142, 60, 0.1)"
              : "transparent",
          }}
        >
          {timerActive ? "Timer is running" : "Timer is paused"}
        </div>
      </div>
    </div>
  );
}

// Helper component for time units
function TimeUnit({ value, label, theme, colors }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-mono text-2xl font-semibold"
        style={{
          color: theme === "dark" ? "#4ec9b0" : "#0078d4",
        }}
      >
        {value}
      </span>
      <span
        className="text-[10px] uppercase -mt-1 font-medium"
        style={{
          color: theme === "dark" ? "#959595" : "#777777",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Helper component for buttons
function TimerButton({
  onClick,
  icon,
  label,
  primary,
  warning,
  danger,
  theme,
  flex = 1,
}) {
  let backgroundColor, hoverColor, textColor;

  if (primary) {
    backgroundColor = theme === "dark" ? "#4ec9b0" : "#0078d4";
    hoverColor = theme === "dark" ? "#3ea995" : "#106ebe";
    textColor = "#ffffff";
  } else if (warning) {
    backgroundColor = theme === "dark" ? "#d7ba7d" : "#f2c811";
    hoverColor = theme === "dark" ? "#c9ad70" : "#e0bb10";
    textColor = theme === "dark" ? "#1e1e1e" : "#1e1e1e";
  } else if (danger) {
    backgroundColor = theme === "dark" ? "#f14c4c" : "#d32f2f";
    hoverColor = theme === "dark" ? "#e04343" : "#c62828";
    textColor = "#ffffff";
  } else {
    backgroundColor = theme === "dark" ? "#3c3c3c" : "#e0e0e0";
    hoverColor = theme === "dark" ? "#4c4c4c" : "#d0d0d0";
    textColor = theme === "dark" ? "#cccccc" : "#333333";
  }

  return (
    <button
      onClick={onClick}
      className="py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all duration-150"
      style={{
        backgroundColor,
        color: textColor,
        flex,
        fontWeight: 500,
        fontSize: "0.8rem",
        boxShadow: `0 1px 2px rgba(0, 0, 0, ${
          theme === "dark" ? "0.3" : "0.1"
        })`,
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColor)
      }
    >
      {icon}
      {label}
    </button>
  );
}
