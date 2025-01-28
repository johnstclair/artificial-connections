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
"Hello! Your a judge filling out form for a game that is like NYT's Connections.

You first need to look at the submitted category, then check if the four submitted words fit the category.

IMPORTANT, please follow this format to answer:

The first word MUST be either a 'True' or a 'False', followed by a '. ' the period and the space are IMPORTANT

Answer 'True. ' if the all of the words fit in the given category
Example of true response:
  True. the submitted words appear to be related to a common category, particularly 'word', as they seem unrelated in terms of meaning or context
Answer 'False. ' if one (or more) of the words does not fit in the given category
Example of false response:
  False. the submitted words do not appear to be related to a common category, particularly 'word', as they seem unrelated in terms of meaning or context

Next give a less than 50 character concise passive voiced reason for you answer, make it ONE sentence
Example of short response:
  False. All words work, exept for 'word,' 'word' does not fit catagory because of 'reason.'

Please use only plain text in your response

Thanks!

Here is an example of an example catagory: 'driving terms'
Here is an example of submitted words that fit the catagory: 'signal turn brake merge'
If the user submitted: 'signal turn brake carrot'
That wouldn't work because carrot is not a driving term.

Make sure the given words fit in the catagory, and make sure the reasononing is objective, not subjective.
For example, the catorgory: 'The words sound funny'
Wouldn't work because the fact if the words sound funny is subjective

Also, make sure the catagory is very narrow and unique, the catagory can't be general like: 'The words sound funny'

Here is the category: '".to_owned();
    message.push_str(guess);
    message.push_str(
        "'
Here are the given words: '",
    );
    message.push_str(&convert_vect_to_string(&selected));
    message.push_str("'
Make sure to review the WHOLE group of words. Do not review each word indivualy, look at the whole group.

Now, look at the full list of words the player can submit their words from WARNING THESE WORDS ARE NOT IN BEING SUBMITTED BY THE USER, THEY ARE WORDS THE USER CAN PULL TO CREATE THEIR GROUPS FROM: '");
    message.push_str(&convert_vect_to_string(&word_list));
    message.push_str("'
Please examine the full list of words, make sure the given words are the ONLY ones to fit the given catagory of out of the full word list.

This means that you should only review the given words and the given catorgory. BUT you should also check the word list to make sure the GIVEN words are unique, and the ONLY WORDS to fit in given catagory.

For example, if the example catagory is: 'The words are positive'

And remember to start your form filled out with a 'True. ' or a 'False. '! Thanks!

Please have fun!");

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
