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
  const [model, setModel] = useState<string>("llama3.1");

  const navigate = useNavigate();

  useEffect(() => {
    getModel().then((result) => {
      setModel(result)
    });
  }, []);

  function onSubmit() {
    console.log(model);
    writeModel(model);

    navigate("/play");
  }

  return <>
    <button onSubmit={(e) => onSubmit()}>clock me</button>
    <input value={model} onChange={(e) => {setModel(e.target.value)}}></input>
  </>
}
export default Start;
