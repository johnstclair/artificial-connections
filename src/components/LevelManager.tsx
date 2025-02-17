import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exists, mkdir, writeTextFile, readDir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { generate } from "random-words";
import { load } from '@tauri-apps/plugin-store';

async function writeFile(name: string, contents: string) {
  await writeTextFile(`levels/${name}.txt`, contents, {
    baseDir: BaseDirectory.AppData,
  });
}

function LevelManager() {
  const [text, setText] = useState<string>("");
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  function createLevel() {
    let temp = [];
    text.trim().split(/\r?\n/).map((item) => {
      temp.push(item);
    });

    if (temp.length != 16) return;
    console.log("length good");
    if (name == "") return;
    console.log("name good");

    writeFile(name, text);
  }

  return (<>
    <textarea className="levelCreateForm" value={text} onChange={(e) => {setText(e.target.value)}}></textarea>
    <input value={name} onChange={(e) => {setName(e.target.value)}}></input>
    <button onClick={() => createLevel()}>create level</button>
    <button onClick={() => navigate("/")}>back</button>
  </>)
}

export default LevelManager;
