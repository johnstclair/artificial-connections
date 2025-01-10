import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [blocks, setBlock] = useState(["veil","shake","cable","vision","arrange","offspring","fund","ridge","authorize","parade","suffering","impound","bad","concentration","slippery","artichoke"]);



  return (
  <>
      {blocks.map((word) => {
        return <button>{word}</button>
        console.log({word})
      })}
  </>
  );
}

export default App;
