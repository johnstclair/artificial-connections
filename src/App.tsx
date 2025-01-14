import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [blocks, setBlock] = useState(["veil","shake","cable","vision","arrange","offspring","fund","ridge","authorize","parade","suffering","impound","bad","concentration","slippery","artichoke"]);
  const [selected, setSelected] = useState(new Array(16).fill(false));

  console.log("selected " + selected);

  function handleSelection(wordIndex) {
    let temp = selected;
    temp[wordIndex] =  !temp[wordIndex];
    setSelected(temp);
  }

  function handleSubmit() {
    let words = [];

    selection.map((index, selected) => {
      if (selected) {
        words.push(blocks[index])
      }
    });

    console.log(words)
  }

  return (
  <>
      <div className="button-grid-container">
        {blocks.map((word, index) => {
          return <button onClick={(e) => handleSelection(index)} className="button-grid">{word.toUpperCase()}</button>
          console.log({word});
        })}
      </div>
      <button onClick{(e) => handleSubmit()}>SUBMIT</button>
  </>
  );
}

export default App;
