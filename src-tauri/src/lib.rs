use serde::Serialize;
use std::io::{Read, Write};
use std::path::Path;

use std::fs;
use std::process::{Command, Stdio};
use std::thread;
use std::time::{Duration, Instant};

#[derive(Serialize)]
struct CompileResult {
    success: bool,
    output: String,
}

#[tauri::command]
fn compile_and_run_cpp(
    file_path: String,
    cppenv: String,
    maxruntime: u64,
    input: String,
) -> CompileResult {
    let cpp_path = Path::new(file_path.as_str());

    // Set OS-specific extension for the executable
    let exe_extension = if cfg!(target_os = "windows") {
        "out.exe"
    } else {
        "out"
    };
    let exe_path = cpp_path.with_extension(exe_extension);

    // Ensure the file exists
    if !cpp_path.exists() {
        return CompileResult {
            success: false,
            output: "Source file does not exist.".to_string(),
        };
    }

    let cpp_env = format!("-D{}", cppenv);

    // Step 1: Compile using g++
    let compile = Command::new("g++")
        .arg(cpp_env)
        .arg(file_path)
        .arg("-o")
        .arg(&exe_path)
        .output();

    match compile {
        Ok(compile_output) => {
            if !compile_output.status.success() {
                return CompileResult {
                    success: false,
                    output: String::from_utf8_lossy(&compile_output.stderr).to_string(),
                };
            }

            // Step 2: Run the compiled executable with input
            match Command::new(&exe_path)
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
            {
                Ok(mut child) => {
                    // Feed input to stdin
                    if let Some(mut stdin) = child.stdin.take() {
                        if let Err(e) = stdin.write_all(input.as_bytes()) {
                            return CompileResult {
                                success: false,
                                output: format!("Failed to write to stdin: {}", e),
                            };
                        }
                    }

                    let start = Instant::now();

                    loop {
                        match child.try_wait() {
                            Ok(Some(status)) => {
                                // Get output
                                let mut stdout = String::new();
                                let mut stderr = String::new();

                                if let Some(mut out) = child.stdout.take() {
                                    let _ = out.read_to_string(&mut stdout);
                                }

                                if let Some(mut err) = child.stderr.take() {
                                    let _ = err.read_to_string(&mut stderr);
                                }

                                // Clean up the executable file
                                let _ = fs::remove_file(&exe_path);

                                return CompileResult {
                                    success: status.success(),
                                    output: format!("{}{}", stdout, stderr),
                                };
                            }
                            Ok(None) => {
                                if start.elapsed() >= Duration::from_secs(maxruntime) {
                                    let _ = child.kill();
                                    // Clean up the executable file
                                    let _ = fs::remove_file(&exe_path);

                                    return CompileResult {
                                        success: false,
                                        output: format!(
                                            "Execution timed out after {} seconds.",
                                            maxruntime
                                        ),
                                    };
                                }
                                thread::sleep(Duration::from_millis(100));
                            }
                            Err(e) => {
                                // Clean up the executable file
                                let _ = fs::remove_file(&exe_path);

                                return CompileResult {
                                    success: false,
                                    output: format!("Failed to wait for process: {}", e),
                                };
                            }
                        }
                    }
                }
                Err(e) => {
                    // Clean up the executable file
                    let _ = fs::remove_file(&exe_path);

                    CompileResult {
                        success: false,
                        output: format!("Failed to run executable: {}", e),
                    }
                }
            }
        }
        Err(e) => CompileResult {
            success: false,
            output: format!("Failed to compile: {}", e),
        },
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_pty::init())
        .invoke_handler(tauri::generate_handler![compile_and_run_cpp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
