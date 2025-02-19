import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { remove, writeTextFile, readDir, BaseDirectory } from '@tauri-apps/plugin-fs';

async function writeFile(name: string, contents: string) {
  await writeTextFile(`levels/${name}.txt`, contents, {
    baseDir: BaseDirectory.AppData,
  });
}

async function readLevels() {
  return await readDir('levels', { baseDir: BaseDirectory.AppData });
}

async function deleteFile(name: string) {
  return await remove(`levels/${name}.txt`, { baseDir: BaseDirectory.AppData });
}

function LevelManager() {
  const [text, setText] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [levels, setLevels] = useState<string[]>([""]);
  const navigate = useNavigate();

  useEffect(() => {
    readLevels().then((result) => {
      let temp: string[] = [];
      result.map((item) => {
        temp.push(item.name.replace(/\.txt$/, ""));
      });
      temp.splice(temp.indexOf("random"),1);
      temp.splice(temp.indexOf("Premade Level"),1);
      setLevels(temp);
    })
  }, []);

  function createLevel() {
    let temp: string[] = [];
    text.trim().split(/\r?\n/).map((item) => {
      temp.push(item);
    });

    if (temp.length != 16 || temp.indexOf("") != -1) return;
    console.log("length good");
    if (name == "") return;
    console.log("name good");

    writeFile(name, text);
  }

  return (<>
    <div className="name">
      <h3>Level Manager</h3>
    </div>
    <textarea className="levelCreateForm" value={text} onChange={(e) => {setText(e.target.value)}}></textarea>
    <input placeholder="Level Name" value={name} onChange={(e) => {setName(e.target.value)}}></input>
    <button onClick={() => createLevel()}>create level</button>
    {levels.map((item, index) => {
      return <><button key={index} onClick={() => deleteFile(item)}>delete {item}</button><br/></>

    })}
    <button onClick={() => navigate("/")}>back</button>
  </>)
}

export default LevelManager;
