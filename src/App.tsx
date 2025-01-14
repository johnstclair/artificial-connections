import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const wordList = ["veil","shake","cable","vision","arrange","offspring","fund","ridge","authorize","parade","suffering","impound","bad","concentration","slippery","artichoke"];
  const [selected, setSelected] = useState<(string | boolean)[]>([]);
  const [blocks, setBlocks] = useState<(string | boolean)[][]>([]);

  const [argue, setArgue] = useState<string>("");

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

  function handleSubmit() {
    if (selected.length != 4) {
      return;
    }
    console.log(selected + " and " + argue);

    setArgue("");
    selected.map((s) => {
      let temp = [...blocks];
      temp[temp.findIndex(block => block[0] == s)][1] = false;
    })
    setSelected([])
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
      <input onChange={(e) => {setArgue(e.target.value)}}></input>
  </>
  );
}

export default App;
