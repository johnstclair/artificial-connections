import { useCallback, useState, useEffect } from "react";
import { load } from '@tauri-apps/plugin-store';
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { ToastContainer, Slide, toast } from 'react-toastify';
import { readTextFileLines, BaseDirectory } from '@tauri-apps/plugin-fs';

import "./Loading.css";

async function getLevel() {
  const store = await load('settings.json', { autoSave: false });
  const val = await store.get<{value: string}>('level');
  if (val != undefined) {
    return val.value
  }
  return "random"
}

async function getModel() {
  const store = await load('settings.json', { autoSave: false });
  const val = await store.get<{value: string}>('model');
  if (val != undefined) {
    return val.value
  }
  return "deepseek-r1:8b"
}

async function getWordbank(level: string) {
  const lines = await readTextFileLines(`levels/${level}.txt`, {
    baseDir: BaseDirectory.AppData,
  });
  let temp = [];
  for await (const line of lines) {
    temp.push(line.replace(/\0/g, ''));
  }

  return temp;
}

function GameScreen() {
  const [wordList, setWordlist] = useState<string[]>([]);
  const [selected, setSelected] = useState<(string)[]>([]);
  const [model, setModel] = useState<string>("");
  const [blocks, setBlocks] = useState<(string | boolean)[][]>([]);
  const [gotten, setGotten] = useState<string[][]>([]);
  const [life, setLife] = useState<number>(4);

  const [guess, setGuess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const navigate = useNavigate();

  const llmCallback = useCallback(async () => {
    setLoading(true)
    let data = await invoke('check_guess', { model: model, guess: guess, selected: selected, gotten: gotten, wordList: wordList });
    setLoading(false);
    return data
  }, [selected, guess, gotten, model, wordList]);

  if (life == 0) {
    navigate("/");
  }

  useEffect(() => {
    getModel().then((result) => {
      setModel(result)
    });

    getLevel().then((result) => {
      const level = result;

      getWordbank(level).then((list) => {
        setWordlist(list);
        let temp: (string | boolean)[][] = [];
        list.map((word) => {
          temp.push([word,false]);
        });
        setBlocks(temp);
      });
    });
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
        temp[index][0].toString()
      ]);
    } else if (blocks[index][1]) {
      let temp = [...blocks];
      temp[index][1] = !temp[index][1];

      setSelected(selected.filter(s =>
        s != temp[index][0]
      ));
    }
  }


  useEffect(() => {
    setCanSubmit(canSubmitCheck());
    if (gotten.length == 4) {
      navigate("/win");
    }
  })

  function canSubmitCheck() {
    setGuess(guess.replace(/'/g, ""));
    setGuess(guess.slice(0,40))
    if (selected.length != 4 || guess.length <= 3 || loading) {
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    let msg = await llmCallback() as string;

    if (msg.indexOf("</think>") != -1) {
      msg = msg.substring(msg.indexOf("</think>") + 8)
    };
    if (msg.indexOf("Final Answer") != -1) {
      msg = msg.substring(msg.indexOf("Final Answer") + 12)
    };
    const trueIndex = msg.indexOf("True.");
    const falseIndex = msg.indexOf("False.");
    let startIndex;
    if (trueIndex !== -1 && (falseIndex === -1 || trueIndex < falseIndex)) {
        startIndex = trueIndex;
    } else if (falseIndex !== -1) {
        startIndex = falseIndex;
    } 
   
    if (startIndex != undefined) {
      msg = msg.substring(startIndex);
    }
    msg = msg.replace(/\\n/g, " ").replace(/\\/g, "").slice(0, -1).toLowerCase().trim();
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
        second[currentIndex].push(s.toUpperCase());
      })

      setGotten(second);

      setSelected([]);
    } else {
      setLife(life-1);
    }

    setGuess("");
    toast(msg);
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
      <ToastContainer
        position="top-center"
        autoClose={20000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="dark"
        transition={Slide}
      />
      <div className="middle-div">
        <p>Create groups of four and a catagory to go along!</p>
      </div>
      <div className="box-container">
        {gotten.map((row, index) => {
          return <div key={index} className={`solved number${index}`}>
            <h3>{row[0].toUpperCase()}</h3>
            <p>{`${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}`}</p>
          </div>
        })}
        <div className="button-grid-container">
          {blocks.map((item, index) => {
            return <button key={index} onClick={() => handleSelection(index)} className={`button-grid ${item[1] ? "selected" : ""}`}>
              {item[0].toString().toUpperCase()}
            </button>
          })}
        </div>
      </div>
      <div className="middle-div">
        <div className="life-container">
          <p>Mistakes Remaining:</p>
          <div className="life">
            {Array.apply(0,Array(life)).map((_x,i) => {
                return <div key={i} className="life-dot"></div>
            })}
          </div>
        </div>
      </div>
      <div className="middle-div">
        <button className={(!canSubmit || loading) ? "deactivated" : "activated"} onClick={() => handleSubmit()}>Submit</button>
        <input placeholder="Catagory" value={guess} onChange={(e) => {setGuess(e.target.value)}}></input>
        <button onClick={() => handleShuffle()}>Shuffle</button>
        <button className={selected.length == 0 ? "deactivated" : ""} onClick={() => handleDeselect()}>Deselect</button>
      </div>
      {
      loading ? <div className="middle-div">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div> : <></>
      }
  </>
  );
}

export default GameScreen;
