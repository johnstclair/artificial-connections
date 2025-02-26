import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exists, mkdir, writeTextFile, readDir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { generate } from "random-words";
import { load } from '@tauri-apps/plugin-store';

async function writeCurated() {
  const curatedExists = await exists('levels/Premade Level.txt', {
    baseDir: BaseDirectory.AppData,
  });
  if(!curatedExists) { 
    const contents = "extra\nball\nwon\nmug\npin\ncopy\ntoo\ntee\nate\nspare\npen\nlane\nalley\ntote\nfor\nbackup";
    await writeTextFile('levels/Premade Level.txt', contents, {
      baseDir: BaseDirectory.AppData,
    });
  }
}

async function writeRandom() {
  let temp: string[] | string = generate(16);
  let contents = "";
  for (let i = 0; i < 16; i++) {
    contents += temp[i] + "\n";
  }

  await writeTextFile('levels/random.txt', contents, {
    baseDir: BaseDirectory.AppData,
  });
}

async function createLevels() {
  const levelsExist = await exists('levels', {
    baseDir: BaseDirectory.AppData,
  });
  if (!levelsExist) { 
    await mkdir('levels', {
      baseDir: BaseDirectory.AppData,
    });
  }
}

async function readLevels() {
  return await readDir('levels', { baseDir: BaseDirectory.AppData });
}

async function writeLevel(level: string) {
  const store = await load('settings.json', { autoSave: false });
  await store.set('level', { value: level } );
  await store.save();
}

function Levels() {
  const [levels, setLevels] = useState<string[]>(["random"]);
  const [selectedLevel, setSelectedLevel] = useState<string>("random");
  const navigate = useNavigate();

  useEffect(() => {
    createLevels().then(() => {
      writeRandom();
      writeCurated();
    });
    readLevels().then((result) => {
      let temp: string[] = [];
      result.map((item) => {
        temp.push(item.name.replace(/\.txt$/, ""));
      });
      temp.splice(temp.indexOf("random"),1);
      temp.splice(temp.indexOf("Premade Level"),1);
      setLevels(temp);
    })
  }, [])

  const onSubmit = (() => {
    writeLevel(selectedLevel);
    navigate("/play");
  })

  return <>
    <div className="name">
      <h3>Select a level</h3>
    </div>
    <div className="middle-div vertical-align">
      <select id="levelSelect" onChange={(e) => setSelectedLevel(e.target.value)}>
        <option value="random">random</option>
        <option value="Premade Level">Premade Level</option>
        {levels.map((item, index) => {
          return <option value={item} key={index}>{item}</option>
        })}
      </select>
      <button onClick={() => onSubmit()}>Play</button>
    </div>
  </>
} 

export default Levels
