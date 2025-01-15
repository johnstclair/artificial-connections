// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn check_guess(guess: &str) -> String {
    guess.into()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_guess])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
