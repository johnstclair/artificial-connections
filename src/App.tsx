import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const wordList = ["veil","shake","cable","vision","arrange","offspring","fund","ridge","authorize","parade","suffering","impound","bad","concentration","slippery","artichoke"];
  const [selected, setSelected] = useState<(string | boolean)[]>([]);
  const [blocks, setBlocks] = useState<(string | boolean)[][]>([]);

  const [guess, setGuess] = useState<string>("");

  console.log(selected);

  useEffect(() => {
    let temp: (string | boolean)[][] = [];
    wordList.map((word) => {
      temp.push([word,false]);
    });
    setBlocks(temp);
  }, []);

  function handleSelection(index: number) {
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
    if (selected.length != 4) {
      return;
    }

    const msg = await invoke('check_guess', { guess: guess });

    console.log(msg);

    if (msg != "false") {
      const temp = [...blocks];
        /*
        setBlocks(blocks.filter(b => 
          b[0] != s
        ))
        */
      for (let i = 0; i < 4; i++) {
        console.log(temp[temp.findIndex(block => block[1])]);
        temp.splice(temp.findIndex(block => block[1]),1);
      }

      console.log(temp)

      setBlocks(temp);
/*
      selected.map((s) => {
        let temp = [...blocks];
        temp[temp.findIndex(block => block[0] == s)][1] = false;
      })
*/
      setSelected([])
    }

    setGuess("");
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
      <div className="button-grid-container">
        {blocks.map((item, index) => {
          return <button key={index} onClick={(e) => handleSelection(index)} className={`button-grid ${item[1] ? "selected" : ""}`}>
            {item[0].toUpperCase()}
          </button>
        })}
      </div>
      <button onClick={() => handleSubmit()}>SUBMIT</button>
      <input value={guess} onChange={(e) => {setGuess(e.target.value)}}></input>
      <button onClick={() => handleShuffle()}>SHUFFLE</button>
  </>
  );
}

export default App;
