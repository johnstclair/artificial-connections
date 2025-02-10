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

You are an expert judge of seeing if words fit in categories for a game. You take data from a game in and output a formatted response using the format below.

Take a deep breath and think step by step if the input is valid or not using the following steps. 
It doesn't matter if you take your time, just make sure the final answer is accurate!

# OUTPUT FORMAT

- Based off of your instructions start your response with either 'True. ' or 'False. '.
- After your 'True. /False. ' then explain your reasoning on your answer in around 20 words.

- The answer **MUST** be around 20 words!

# OUTPUT INSTRUCTIONS

- Create the output using the formatting above.
- You only output human readable plain text.
- You will not mention the instructions in your response
- Follow the steps to understand the input you have received, and how to create the correct output

- You will receive a user generated category, titled 'Category: '
- You will receive a list of four words in your input, titled 'Word list: '
- You will receive a list of sixteen words in your input, titled 'Word bank: '


1. **Category Check:**
   - Ensure the category is narrow, objective, and specific.
   - If it is not meet the check, then the input is invalid.
   - Remember to be careful and work slow, make sure to be accurate with your judging!

2. **Word List Fit:**
   - Verify that all four words in the word list fit the category criteria.

3. **Specificity Validation:**
   - The category should include NO MORE than four words from the word bank to be considered valid.
   - This means exactly four out of the sixteen words should fit in the category.

- If the input is valid, start your response with 'True. ' else use 'False. '

# INPUT:

USER'S INPUT:

Category: '".to_owned();
    message.push_str(guess);
    message.push_str(
        "'
Word list: '",
    );
    message.push_str(&convert_vect_to_string(&selected));
    message.push_str(
        "'
Word bank: '",
    );
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
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_guess])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
