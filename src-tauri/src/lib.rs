use rand::Rng;
use serde::Serialize;
use std::fs::{remove_file, File};
use std::io::{Read, Write};
use std::path::Path;
use std::process::{Command, Stdio};

#[derive(Serialize)]
struct CompileResult {
    success: bool,
    stage: String, // "compilation" or "execution"
    output: String,
    file_path: String,
}

#[tauri::command]
fn compile_and_run_cpp(filePath: String, input: String) -> Result<CompileResult, String> {
    let path = Path::new(&filePath);
    if !path.exists() || !path.is_file() || path.extension().and_then(|s| s.to_str()) != Some("cpp")
    {
        return Ok(CompileResult {
            success: false,
            stage: "validation".to_string(),
            output: "Invalid file path or not a .cpp file".to_string(),
            file_path: filePath,
        });
    }

    // Generate random file name for executable
    let random_id: u32 = rand::thread_rng().gen();
    let exec_file = format!("temp_{}", random_id);
    let temp_code_file = format!("temp_{}.cpp", random_id);

    // Read code from file
    let mut code = String::new();
    if let Err(e) = File::open(&filePath).and_then(|mut f| f.read_to_string(&mut code)) {
        return Ok(CompileResult {
            success: false,
            stage: "reading".to_string(),
            output: format!("Failed to read file: {}", e),
            file_path: filePath,
        });
    }

    // Write to temp cpp file
    if let Err(e) = File::create(&temp_code_file).and_then(|mut f| f.write_all(code.as_bytes())) {
        return Ok(CompileResult {
            success: false,
            stage: "writing".to_string(),
            output: format!("Failed to create temporary file: {}", e),
            file_path: filePath,
        });
    }

    // Compile using g++
    let compile_output = Command::new("g++")
        .args(&[&temp_code_file, "-o", &exec_file])
        .output();

    if let Err(e) = compile_output {
        cleanup_files(&temp_code_file, &exec_file);
        return Ok(CompileResult {
            success: false,
            stage: "compilation".to_string(),
            output: format!("Failed to execute compiler: {}", e),
            file_path: filePath,
        });
    }

    let compile_output = compile_output.unwrap();
    if !compile_output.status.success() {
        let error = String::from_utf8_lossy(&compile_output.stderr).to_string();
        cleanup_files(&temp_code_file, &exec_file);
        return Ok(CompileResult {
            success: false,
            stage: "compilation".to_string(),
            output: error,
            file_path: filePath,
        });
    }

    // Run the compiled executable
    let mut child = match Command::new(&format!("./{}", exec_file))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
    {
        Ok(c) => c,
        Err(e) => {
            cleanup_files(&temp_code_file, &exec_file);
            return Ok(CompileResult {
                success: false,
                stage: "execution".to_string(),
                output: format!("Failed to start execution: {}", e),
                file_path: filePath,
            });
        }
    };

    // Provide input to the program
    if let Some(stdin) = child.stdin.as_mut() {
        if let Err(e) = stdin.write_all(input.as_bytes()) {
            cleanup_files(&temp_code_file, &exec_file);
            return Ok(CompileResult {
                success: false,
                stage: "execution".to_string(),
                output: format!("Failed to write input: {}", e),
                file_path: filePath,
            });
        }
    }

    let run_output = match child.wait_with_output() {
        Ok(o) => o,
        Err(e) => {
            cleanup_files(&temp_code_file, &exec_file);
            return Ok(CompileResult {
                success: false,
                stage: "execution".to_string(),
                output: format!("Execution failed: {}", e),
                file_path: filePath,
            });
        }
    };

    // Final cleanup
    cleanup_files(&temp_code_file, &exec_file);

    // Return output
    if run_output.status.success() {
        Ok(CompileResult {
            success: true,
            stage: "execution".to_string(),
            output: String::from_utf8_lossy(&run_output.stdout).to_string(),
            file_path: filePath,
        })
    } else {
        Ok(CompileResult {
            success: false,
            stage: "execution".to_string(),
            output: String::from_utf8_lossy(&run_output.stderr).to_string(),
            file_path: filePath,
        })
    }
}

// Helper to clean up temporary files
fn cleanup_files(code_file: &str, exec_file: &str) {
    let _ = remove_file(code_file);
    let _ = remove_file(exec_file);
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![compile_and_run_cpp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
