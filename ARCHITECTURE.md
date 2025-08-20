# Cpitor Technical Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CPITOR APPLICATION                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    FRONTEND (React/Web)                        │   │
│  │                                                                 │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │   │
│  │  │     Layout      │  │     Editor      │  │     Pages       │ │   │
│  │  │   Components    │  │   Components    │  │                 │ │   │
│  │  │                 │  │                 │  │                 │ │   │
│  │  │ • MenuBar       │  │ • CodeEditor    │  │ • HomePage      │ │   │
│  │  │ • TitleBar      │  │ • TabBar        │  │ • SettingsPage  │ │   │
│  │  │ • ActivityBar   │  │ • Breadcrumb    │  │ • AboutPage     │ │   │
│  │  │ • FileExplorer  │  │ • InputOutput   │  │                 │ │   │
│  │  │ • Terminal      │  │ • NoCodeScreen  │  │                 │ │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │                Context Management                          │ │   │
│  │  │                                                             │ │   │
│  │  │  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │ │   │
│  │  │  │ EditorContext│────▶│ File State  │────▶│Theme/Settings│   │ │   │
│  │  │  │             │     │             │     │             │   │ │   │
│  │  │  │ • openFiles │     │ • activeFile│     │ • theme     │   │ │   │
│  │  │  │ • terminal  │     │ • filePath  │     │ • colors    │   │ │   │
│  │  │  │ • settings  │     │ • content   │     │ • fonts     │   │ │   │
│  │  │  └─────────────┘     └─────────────┘     └─────────────┘   │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │              External Dependencies                          │ │   │
│  │  │                                                             │ │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │ │   │
│  │  │  │ Monaco      │  │   WASM      │  │   Tauri APIs        │ │ │   │
│  │  │  │ Editor      │  │ clang-format│  │                     │ │ │   │
│  │  │  │             │  │             │  │ • File System       │ │ │   │
│  │  │  │ • Syntax    │  │ • Code      │  │ • Dialog            │ │ │   │
│  │  │  │   Highlight │  │   Formatting│  │ • Shell             │ │ │   │
│  │  │  │ • Auto      │  │ • Style     │  │ • Store             │ │ │   │
│  │  │  │   Complete  │  │   Options   │  │ • Window            │ │ │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                        │                               │
│                                        │ IPC Communication             │
│                                        │ (Tauri Bridge)                │
│                                        ▼                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     BACKEND (Rust/Tauri)                       │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │                Core Commands                                │ │   │
│  │  │                                                             │ │   │
│  │  │  ┌─────────────────┐           ┌─────────────────────────┐   │ │   │
│  │  │  │ compile_and_run │          │    File Operations      │   │ │   │
│  │  │  │      _cpp       │          │                         │   │ │   │
│  │  │  │                 │          │ • readTextFile          │   │ │   │
│  │  │  │ • File Check    │          │ • writeTextFile         │   │ │   │
│  │  │  │ • G++ Compile   │          │ • readDir               │   │ │   │
│  │  │  │ • Execute       │          │ • Dialog Operations     │   │ │   │
│  │  │  │ • Timeout       │          │ • Store Operations      │   │ │   │
│  │  │  │ • Cleanup       │          │                         │   │ │   │
│  │  │  └─────────────────┘          └─────────────────────────┘   │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │              Security & Permissions                        │ │   │
│  │  │                                                             │ │   │
│  │  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │ │   │
│  │  │  │  File System    │  │   Shell Access  │  │   Window    │ │ │   │
│  │  │  │     Scope       │  │                 │  │  Control    │ │ │   │
│  │  │  │                 │  │ • g++ execution │  │             │ │ │   │
│  │  │  │ • Home folder   │  │ • Arg validation│  │ • Minimize  │ │ │   │
│  │  │  │ • Downloads     │  │ • Process mgmt  │  │ • Close     │ │ │   │
│  │  │  │ • Recursive     │  │                 │  │ • Fullscreen│ │ │   │
│  │  │  └─────────────────┘  └─────────────────┘  └─────────────┘ │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                        │                               │
│                                        │ System Calls                  │
│                                        ▼                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    SYSTEM LAYER                                 │   │
│  │                                                                 │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │   │
│  │  │   File System   │  │    G++ Compiler │  │  Process        │ │   │
│  │  │                 │  │                 │  │  Management     │ │   │
│  │  │ • Read/Write    │  │ • Compilation   │  │                 │ │   │
│  │  │   Operations    │  │ • Linking       │  │ • Execution     │ │   │
│  │  │ • Directory     │  │ • Error         │  │ • Timeout       │ │   │
│  │  │   Navigation    │  │   Reporting     │  │ • I/O Streams   │ │   │
│  │  │                 │  │                 │  │ • Cleanup       │ │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User Action (Click/Type/Shortcut)                                     │
│              │                                                         │
│              ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    React Components                            │   │
│  │  (FileExplorer/CodeEditor/Terminal/Settings)                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   EditorContext                                 │   │
│  │                                                                 │   │
│  │  State Update ──▶ useState/useEffect ──▶ Context Provider      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Tauri API Call                              │   │
│  │                                                                 │   │
│  │  Frontend ──invoke──▶ Tauri Bridge ──▶ Rust Backend           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   System Operations                             │   │
│  │                                                                 │   │
│  │  File I/O ←──→ G++ Compilation ←──→ Process Execution          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Response Chain                               │   │
│  │                                                                 │   │
│  │  Result ──▶ Rust Function ──▶ Tauri ──▶ JavaScript Promise    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     UI Update                                   │   │
│  │                                                                 │   │
│  │  State Change ──▶ Component Re-render ──▶ DOM Update          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── EditorProvider (Context)
├── TitleBar.jsx
├── MenuBar.jsx
├── ActivityBar.jsx
└── AppContent (Conditional rendering based on activeView)
    ├── Home View
    │   └── HomePage.jsx (Lazy loaded)
    ├── Settings View
    │   └── SettingsPage.jsx (Lazy loaded)
    ├── About View
    │   └── AboutPage.jsx (Lazy loaded)
    └── Editor View (Main IDE)
        ├── ResizablePanelGroup (Horizontal)
        │   ├── FileExplorer.jsx (Conditional)
        │   │   └── FileBrowser Component
        │   │       ├── Directory Tree Rendering
        │   │       ├── File Icon System
        │   │       └── Click Handlers
        │   ├── Main Editor Area
        │   │   ├── ResizablePanelGroup (Vertical)
        │   │   │   ├── CodeEditor.jsx
        │   │   │   │   ├── TabBar.jsx
        │   │   │   │   ├── Breadcrumb.jsx
        │   │   │   │   └── Monaco Editor
        │   │   │   └── Terminal.jsx
        │   │   │       ├── Terminal Tab
        │   │   │       ├── Problems Tab
        │   │   │       ├── Debug Tab
        │   │   │       └── Output Tab
        │   │   └── InputOutputPanel.jsx
        │   │       ├── Input Section
        │   │       ├── Output Section
        │   │       └── Test Case Management
        └── NoCodeScreen.jsx (When no files open)
```

## Build & Development Flow

```
Development:
npm run dev ──▶ Vite Dev Server (Port 1420)
                     │
                     ▼
                Tauri Dev Mode ──▶ Desktop Window
                     │                    │
                     ▼                    ▼
              Rust Backend         React Frontend
              (File Watch)         (Hot Reload)

Production:
npm run build ──▶ Vite Build ──▶ Static Assets (dist/)
                      │
                      ▼
               Tauri Build ──▶ Desktop Executable
                      │                │
                      ▼                ▼
              Bundle Assets      Native Binary
              (JavaScript/CSS)   (Platform Specific)
```

## Security Model

```
┌─────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                Application Layer                        │   │
│  │                                                         │   │
│  │  • Input validation in React components                │   │
│  │  • File path sanitization                              │   │
│  │  • User permission prompts                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                Tauri Security Layer                     │   │
│  │                                                         │   │
│  │  • Capability-based permissions                        │   │
│  │  • Command validation and filtering                    │   │
│  │  • Secure IPC communication                            │   │
│  │  • Context isolation                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              System Permissions                         │   │
│  │                                                         │   │
│  │  • File system access control                          │   │
│  │  • Process execution limits                            │   │
│  │  • Network isolation (offline-first)                   │   │
│  │  • Operating system security                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```