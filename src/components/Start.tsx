import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { load } from '@tauri-apps/plugin-store';

async function getModel() {
  const store = await load('settings.json', { autoSave: false });
  const val = await store.get<{value: string}>('model');
  return val.value
}

async function writeModel(model: string) {
  const store = await load('settings.json', { autoSave: false });
  await store.set('model', { value: model } );
  const val = await store.get<{value: string}>('model');
  console.log(val);
  await store.save();
}


function Start() {
  const [model, setModel] = useState<string>("deepseek-r1:8b");

  const navigate = useNavigate();

  useEffect(() => {
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
      <button onClick={(e) => onSubmit()}>Start</button>
      <input placeholder="Model" value={model} onChange={(e) => {setModel(e.target.value)}}></input>
      <button onClick={(e) => navigate("/instructions")}>Learn To Play</button>
      <button onClick={(e) => navigate("/manager")}>Manage Levels</button>
    </div>
  </>
}
export default Start;
