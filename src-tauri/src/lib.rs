fn convert_vect_to_string(ve: &Vec<&str>) -> String {
    let mut temp: String = "".to_owned();
    for i in 0..ve.len() {
        temp.push_str(ve[i]);
        temp.push_str(" ");
    }
    return temp
}

fn convert_solved_to_string(solv: &Vec<Vec<&str>>) -> String {
    if (solv.len() == 0) {
        let t: String = "No catagories have been created yet".to_owned();
        return t
    }
    let mut temp: String = "Catagory: ".to_owned();
    temp.push_str(solv[0][0]);
    temp.push_str("\nItems: ");
    let mut solv_copy = solv[0].clone();
    solv_copy.remove(0);
    temp.push_str(&convert_vect_to_string(&solv_copy));
    return temp
}

#[tauri::command]
fn check_guess(guess: &str, selected: Vec<&str>, gotten: Vec<Vec<&str>>, word_list: Vec<&str>) -> String {
    let selected_string: String = convert_solved_to_string(&gotten[0]);
    println!("{}",selected_string);
    println!("this is a test {guess} {selected:?} {gotten:?} {word_list:?}");
    let mut message: &str = "";
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
