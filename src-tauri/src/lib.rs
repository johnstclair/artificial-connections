use serde_json::{json};
use serde_json::Value;

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
async fn check_guess(guess: &str, selected: Vec<&str>, gotten: Vec<Vec<&str>>, word_list: Vec<&str>) -> Result<String,String> {
    /*
    let mut message = "Hello, you are judging a game.\nYour job is to verify if a group of four words fit in a given catagory.\nHere is the catagory: \"".to_owned();
    message.push_str(guess);
    message.push_str("\"\nHere are the words: \"");
    let selected_string = convert_vect_to_string(&selected);
    message.push_str(&selected_string);
    message.push_str("\"\nVERY VERY IMPORTANT: If you don't think the given words fit in the given catagory please explain why they don't fit in less then 250 characters with no newlines, when explaing use a passive and consice voice like 'word XXX does not fit'. Thanks, and have fun! EVEN MORE IMPORTANT!!! You MUST start your response with 'True. ' or 'False. ' based off if the user won or not");
*/

    let mut message: String = 
"Hello! Your a judge filling out form for a game that is like NYT's Connections.

You first need to look at the submitted category, then check if the four submitted words fit the category.

IMPORTANT, please follow this format to answer:

If you don't follow the format you will be fired and thrown in a grinder.

The first word MUST be either a 'True' or a 'False', followed by a '. ' the period and the space are IMPORTANT

Answer 'True. ' if the words fit in the given category
Example of true response:
  True. the submitted words appear to be related to a common category, particularly 'word', as they seem unrelated in terms of meaning or context
Answer 'False. ' if the words do not fit in the given category
Example of false response:
  False. the submitted words do not appear to be related to a common category, particularly 'word', as they seem unrelated in terms of meaning or context

Please use only plain text in your response

Next give a less than 50 character concise passive voiced reason for you answer, make it ONE sentence

Thanks!

Here is the category: ".to_owned();
    message.push_str(guess);
    message.push_str("
Here are the words: ");
    message.push_str(&convert_vect_to_string(&selected));
    message.push_str("
Make sure to review the WHOLE group of words. Do not review each word indivualy, look at the whole group.

And remember to start your form filled out with a 'True. ' or a 'False. '! Thanks!

Please have fun!");

    let data = json!({
        "model": "llama3.2",
        "prompt": message,
        "stream": false,
    });

    println!("{}",data);

    let client = reqwest::Client::new();
    match client.post("http://localhost:11434/api/generate")
        .json(&data)
        .send()
        .await
    {
        Ok(response) => {
            if response.status().is_success() {
                match response.text().await {
                    Ok(body) => {
                        let json: Value = serde_json::from_str(&body).map_err(|e| format!("Error parsing JSON: {}", e))?;

                        if let Some(response_value) = json.get("response") {
                            Ok(format!("{}", response_value))
                        } else {
                            Err(format!("Key 'response' not found in the response.").into())
                        }
                    }
                    Err(err) => Err(format!("There was an error handling the response, please report this on GitHub, thanks! - {}", err)),
                }
            } else {
                Err(format!("There was an error communicating with Ollama, please report this on GitHub, thanks! - {}", response.status()))
            }
        }
        Err(err) => Err(format!("Oops! It looks like Ollama isn't started.")),
    }
/*
    println!("{:?}", res);

    for i in 0..gotten.len() {
        let selected_string: String = convert_solved_to_string(gotten[i].clone());
        //println!("{}",selected_string);
    }

    //println!("this is a test {guess} {selected:?} {gotten:?} {word_list:?}");
    let mut message: &str = "";
    guess.into()
*/
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_guess])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
