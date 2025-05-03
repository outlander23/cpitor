# Cpitor

Cpitor is a **lightweight Linux-based text editor** tailored for **competitive programmers**.  
It delivers a fast, efficient, and streamlined environment to write, test, and debug C++ (and other languages) with a sleek UI and minimal resource footprint.

> 🚀 **Download size:** ~5 MB  
> 🖥️ **Memory usage:** < 40 MB RAM

---

## 📦 Project Links

- **Repository:** https://github.com/outlander23/cpitor
- **Releases:** https://github.com/outlander23/cpitor/releases
- **Issue Tracker:** https://github.com/outlander23/cpitor/issues

---

## 🏆 Core Features

- **Optimized for Competitive Programming**

  - **Syntax Highlighting** & **Auto-Indentation**
  - **Fast Scrolling** for large code files
  - **Single-Key Compile & Run** (F7)

- **Test Case Management**

  - Side-by-side Input/Output panels
  - Save and switch between multiple test cases

- **Timer**

  - Track your coding sessions
  - Countdown mode for contest simulation

- **One-Click Compilation**
  - Pre-configured C++ toolchain
  - Instant feedback in the integrated console

---

## 📂 Lightweight File Management

- Open, edit, and save `.cpp`, `.h`, and plain-text files
- Create new files from customizable boilerplate templates
- **Recent Projects** sidebar for quick access

---

## 🎨 Customizable Themes & Settings

- Toggle between **Light** and **Dark** modes
- Fully customize:
  - Editor Colors
  - Font Family & Size
  - Tab Width & Indentation
- Save multiple profiles in JSON

---

## ⚙️ Advanced Settings

You can fine-tune your environment with two new options in the JSON config:

1. **Max Runtime (s)**  
   Limit the execution time of your program. If it exceeds the given seconds, Cpitor will terminate the process.

2. **Environment Flags (JSON)**  
   Pass custom `#define` flags at compile time to enable/disable features in your code.  
   Example config snippet:

   ```cpp
   #include <bits/stdc++.h>
   using namespace std;

   int main() {
   #ifdef ONPC
       cout << "Running in local debug mode" << endl;
   #endif
       return 0;
   }
   ```

---

## 🚀 Quick Start

1. **Download** the latest release and install

2. **Open** your C++ file:

3. **Compile & Run** with **F7** (default).

---

## 🛠️ Installation

- **Pre-built binary** (recommended):  
  Download from the [Releases page](https://github.com/outlander23/cpitor/releases).

---

## 🙌 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes.
4. Open a Pull Request.

---

## 📄 License

MIT License © 2025 Cpitor Project
