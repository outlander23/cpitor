// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn root_dir() -> String {
    std::env::current_dir()
        .unwrap_or_else(|_| std::path::PathBuf::from("unknown"))
        .to_str()
        .unwrap_or("unknown")
        .to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, root_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
