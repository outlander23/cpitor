use tauri_plugin_fs;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init()) // ✅ INIT HERE
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
