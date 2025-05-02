import {
  X,
  Minus,
  Square,
  Maximize2,
  Search,
  RefreshCcw,
  MonitorSmartphone,
  Wrench,
} from "lucide-react";
import { useState, useEffect } from "react";
import Keybindings from "../../utils/keybindings";
import logo from "../../assets/logo.png";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();
  return (
    <div className="flex items-center justify-between h-10 bg-[#1f1f1f] border-b border-[#1a1a1a]"></div>
  );
}
