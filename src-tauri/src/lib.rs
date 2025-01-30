use serde_json::json;
use serde_json::Value;

fn convert_vect_to_string(ve: &Vec<&str>) -> String {
    let mut temp: String = "".to_owned();
    for i in 0..ve.len() {
        temp.push_str(ve[i]);
        temp.push_str(" ");
    }
    return temp;
}

fn convert_solved_to_string(solv: Vec<&str>) -> String {
    let mut temp: String = "Catagory: ".to_owned();
    temp.push_str(solv[0]);
    temp.push_str("\nItems: ");
    let mut solv_clone = solv.clone();
    solv_clone.remove(0);
    temp.push_str(&convert_vect_to_string(&solv_clone));
    return temp;
}

#[tauri::command]
async fn check_guess(
    model: &str,
    guess: &str,
    selected: Vec<&str>,
    _gotten: Vec<Vec<&str>>,
    word_list: Vec<&str>,
) -> Result<String, String> {
    let mut message: String = 
"
# IDENTITY and PURPOSE

You are an expert content judge for word puzzles. You take data from a game in and output a formatted response using the format below.

Take a deep breath and think step by step about how to best accomplish this goal using the following steps.

# OUTPUT FORMAT

- Based off of your instructions start your response with either 'True. ' or 'False. '.

- Then explain your reasoning in around 25 words.

# OUTPUT INSTRUCTIONS

- Create the output using the formatting above.
- You only output human readable plain text.
- You will receive a category that the words *should* fit in, titled 'Catagory: '
- You will receive a list of four words in your input, titled 'Word list: '
- IGNORE the input labled 'Word bank: ' for now
- Then determine if the four words objectively fit in the narrow category
- Make sure the category is narrow - only encimpassing a specific set of words, ex: 'All words at types of candy'. Make sure the catagory is not general, ex: 'Positive words'
- Make sure the catagory isn't subjective, ex: 'The words sound funny' is invalid

- ONLY DO THIS SECTION IF THE WORD LIST AND CATAGORY IS VALID AT THIS POINT
- Now look at your word bank, you will also have receive a list of 16 words, called 'Word bank: '
- The word bank is where the word list words come from
- If more words in the word bank than just the words in the word list fit in the catagory, the catagory is invalid 
    - This is because the catagory is not specific enough to encompass just the words in the word list

- If the word list fits the catagory and is valid, start your response with 'True. ' else use 'False. '

- Remember, be sceptical, their should only be a valid if the catagory fits very very well with the word list, the input should only be valid in around 50% of cases

# INPUT:

INPUT:
Catagory: '".to_owned();
    message.push_str(guess);
    message.push_str("'
Word list: '");
    message.push_str(&convert_vect_to_string(&selected));
    message.push_str("'
Word bank: 
'");
    message.push_str(&convert_vect_to_string(&word_list));
    message.push_str("'");

    let data = json!({
        "model": model,
        "prompt": message,
        "stream": false,
    });

    println!("{}", data);

    let client = reqwest::Client::new();
    match client
        .post("http://localhost:11434/api/generate")
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
        Err(_err) => Err(format!("Oops! It looks like Ollama isn't started.")),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_guess])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
