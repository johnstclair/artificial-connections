import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, Slide, toast } from 'react-toastify';
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

  function read() {
    readLevels().then((result) => {
      let temp: string[] = [];
      result.map((item) => {
        temp.push(item.name.replace(/\.txt$/, ""));
      });
      temp.splice(temp.indexOf("random"),1);
      temp.splice(temp.indexOf("Premade Level"),1);
      setLevels(temp);
    })
  }

  useEffect(() => {
    read();
  }, []);

  function createLevel() {
    let temp: string[] = [];
    text.trim().split(/\r?\n/).map((item) => {
      temp.push(item);
    });

    if (temp.length != 16 || temp.indexOf("") != -1) {
      toast("Word list not formatted correctly");
      return;
    };
    console.log("length good");
    if (name.trim() == "") {
      toast("Please enter a name with the correct formatting");
      return;
    };
    console.log("name good");

    writeFile(name, text);
    read();
  }

  function delFile(name: string) {
    deleteFile(name);
    read();
  }

  return (<>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="dark"
        transition={Slide}
      />
    <div className="name">
      <h3>Level Manager</h3>
    </div>
    <div className="columns">
      <div className="column">
        <h4>Level Create</h4>
        <textarea placeholder='Go to the "Learn to Play" to learn how to format a level' className="levelCreateForm" value={text} onChange={(e) => {setText(e.target.value)}}></textarea>
        <br/>
        <div className="middle-div">
          <input placeholder="Level Name" value={name} onChange={(e) => {setName(e.target.value)}}></input>
          <button onClick={() => createLevel()}>Create Level</button>
        </div>
      </div>
      <div className="column">
        <h4>Delete Files</h4>
        {levels.map((item, index) => {
          return <><button className="delete-button" key={index} onClick={() => delFile(item)}></button><span className="delete-words">{item}</span><br/></>
        })}
      </div>
    </div>
    <div className="middle-div">
      <button onClick={() => navigate("/")}>Back</button>
    </div>
  </>)
}

export default LevelManager;
