fn convert_vect_to_string(ve: &Vec<&str>) -> String {
    let mut temp: String = "".to_owned();
    for i in 0..ve.len() {
        temp.push_str(ve[i]);
        temp.push_str(" ");
    }
    return temp
}

fn convert_solved_to_string(solv: Vec<&str>) -> String {
    let mut temp: String = "Catagory: ".to_owned();
    temp.push_str(solv[0]);
    temp.push_str("\nItems: ");
    let mut solv_clone = solv.clone();
    solv_clone.remove(0);
    temp.push_str(&convert_vect_to_string(&solv_clone));
    return temp
}

#[tauri::command]
fn check_guess(guess: &str, selected: Vec<&str>, gotten: Vec<Vec<&str>>, word_list: Vec<&str>) -> String {
    let mut message = "Hello, you are judging a game.\nYour job is to verify if a group of four words fit in a given catagory.\nHere is the catagory: ".to_owned();
    message.push_str(guess);
    message.push_str("\nHere are the words: ");
    let selected_string = convert_vect_to_string(&selected);
    message.push_str(&selected_string);
    message.push_str("\nIMPORTANT: Please reply: 'true' if you believe the words fit in the given catagory, if you don't think the words fit the catagory please explain why they don't fit in less then 250 characters. Thanks!");

    println!("{}",message);

    for i in 0..gotten.len() {
        let selected_string: String = convert_solved_to_string(gotten[i].clone());
        //println!("{}",selected_string);
    }

    //println!("this is a test {guess} {selected:?} {gotten:?} {word_list:?}");
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
