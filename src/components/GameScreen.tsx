import { useCallback, useState, useEffect } from "react";
import { load } from '@tauri-apps/plugin-store';
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

async function getModel() {
  const store = await load('settings.json', { autoSave: false });
  const val = await store.get<{value: string}>('model');
  return val.value
}

function GameScreen() {
  const wordList: string[] = ["extra","ball","won","mug","pin","copy","too","tee","ate","spare","pen","lane","alley","tote","for","backup"];
  const [selected, setSelected] = useState<(string)[]>([]);
  const [model, setModel] = useState<string>("");
  const [blocks, setBlocks] = useState<(string | boolean)[][]>([]);
  const [gotten, setGotten] = useState<string[][]>([]);
  const [life, setLife] = useState<number>(4);

  const [guess, setGuess] = useState<string>("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const llmCallback = useCallback(async () => {
    setLoading(true)
    let data = await invoke('check_guess', { model: model, guess: guess, selected: selected, gotten: gotten, wordList: wordList });
    setLoading(false);
    return data
  });

  if (life == 0) {
    navigate("/");
  }

  useEffect(() => {
    getModel().then((result) => {
      setModel(result)
    });

    let temp: (string | boolean)[][] = [];
    wordList.map((word) => {
      temp.push([word,false]);
    });
    setBlocks(temp);
  }, []);

  function handleSelection(index: number) {
    if (loading) {
      return
    }

    if (!blocks[index][1] && selected.length < 4) {
      let temp = [...blocks];
      temp[index][1] = !temp[index][1];

      setSelected([
        ...selected,
        temp[index][0]
      ]);
    } else if (blocks[index][1]) {
      let temp = [...blocks];
      temp[index][1] = !temp[index][1];

      setSelected(selected.filter(s =>
        s != temp[index][0]
      ));
    }
  }

  async function handleSubmit() {
    if (selected.length != 4 || guess.length <= 3 || loading) {
      return;
    }

    let msg: string = await llmCallback();

    msg = msg.substring(msg.indexOf("</think>") + 8);
    msg = msg.substring(msg.indexOf("Final Answer") + 12);
    const trueIndex = msg.indexOf("True.");
    const falseIndex = msg.indexOf("False.");
    let startIndex;
    if (trueIndex !== -1 && (falseIndex === -1 || trueIndex < falseIndex)) {
        startIndex = trueIndex;
    } else if (falseIndex !== -1) {
        startIndex = falseIndex;
    } 
    
    msg = msg.substring(startIndex);
    msg = msg.replace(/\\n/g, " ").replace(/\\/g, "").replace(/[^a-zA-Z]*$/, "").toLowerCase().trim();
    let words: string[] = msg.split(' ');
    let result: string = words[0];
    result = result.replace(/[".]/g, '');
    msg = words.slice(1).join(' ');

    if (result.toLowerCase() == "true") {
      let temp = [...blocks];
      for (let i = 0; i < 4; i++) {
        temp.splice(temp.findIndex(block => block[1]),1);
      }

      setBlocks(temp);

      let second: string[][] = [...gotten];
      second.push([]);
      const currentIndex = second.length-1;

      second[currentIndex].push(guess);

      selected.map((s) => {
        second[currentIndex].push(s);
      })

      setGotten(second);

      setSelected([]);
    } else {
      setLife(life-1);
    }

    setGuess("");
    setNotification(msg);
  }

  function handleDeselect() {
    let temp = [...blocks];

    selected.map((s) => {
      temp[temp.findIndex(block => block[0] == s)][1] = false;
    })

    setBlocks(temp);
    setSelected([]);
  }

  function handleShuffle() {
    let temp = [...blocks];
    let currentIndex = blocks.length;
 
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [temp[currentIndex], temp[randomIndex]] = [
        temp[randomIndex], temp[currentIndex]];
    }
    setBlocks(temp);
  }

  return (
  <>
      {gotten.map((row, index) => {
        return <div key={index} className={`solved number${index}`}>
          <h3>{row[0]}</h3>
          <p>{`${row[1]} ${row[2]} ${row[3]} ${row[4]}`}</p>
        </div>
      })}
      <div className="button-grid-container">
        {blocks.map((item, index) => {
          return <button key={index} onClick={() => handleSelection(index)} className={`button-grid ${item[1] ? "selected" : ""}`}>
            {item[0].toUpperCase()}
          </button>
        })}
      </div>
      <div className="life">
        {Array.apply(0,Array(life)).map((x,i) => {
            return <div key={i} className="life-dot"></div>
        })}
      </div>
      <button onClick={() => handleSubmit()}>SUBMIT</button>
      <input value={guess} onChange={(e) => {setGuess(e.target.value)}}></input>
      <button onClick={() => handleShuffle()}>SHUFFLE</button>
      <button onClick={() => handleDeselect()}>DESELECT</button>
      <h1>{notification}</h1>
      {loading ? <h1>thinking</h1> : <h1>not thinking</h1>}
  </>
  );
}

export default GameScreen;
