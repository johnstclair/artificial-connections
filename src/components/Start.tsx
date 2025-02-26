import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { load } from '@tauri-apps/plugin-store';
import { exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';

async function getModel() {
  const store = await load('settings.json', { autoSave: false });
  const val = await store.get<{value: string}>('model');
  if (val != undefined) {
    return val.value
  }
  return "deepseek-r1:8b"
}

async function writeModel(model: string) {
  const store = await load('settings.json', { autoSave: false });
  await store.set('model', { value: model } );
  await store.save();
}

async function createBasedir() {
  const dirExists = await exists('', {
    baseDir: BaseDirectory.AppData,
  });
  if (!dirExists) { 
    await mkdir('', {
      baseDir: BaseDirectory.AppData,
    });
  }
}

function Start() {
  const [model, setModel] = useState<string>("deepseek-r1:8b");

  const navigate = useNavigate();

  useEffect(() => {
    createBasedir();
    getModel().then((result) => {
      setModel(result)
    });
  }, []);

  function onSubmit() {
    writeModel(model);

    navigate("/levels");
  }

  return <>
    <div className="name">
      <h3>Artificial Connections</h3>
    </div>
    <div className="middle-div vertical-align">
      <button onClick={() => onSubmit()}>Start</button>
      <input placeholder="Model" value={model} onChange={(e) => {setModel(e.target.value)}}></input>
      <button onClick={() => navigate("/instructions")}>Learn To Play</button>
      <button onClick={() => navigate("/manager")}>Manage Levels</button>
    </div>
  </>
}
export default Start;
