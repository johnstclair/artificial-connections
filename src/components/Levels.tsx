import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exists, mkdir, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { generate } from "random-words";

async function writeRandom() {
  const levelsExist = await exists('levels', {
    baseDir: BaseDirectory.AppData,
  });
  if (!levelsExist) { 
    await mkdir('levels', {
      baseDir: BaseDirectory.AppData,
    });
  }

  let temp: string[] = generate(16);
  let contents = "";
  temp.map((item) => {
    console.log(item);
    contents += item + "\n";
  });

  await writeTextFile('levels/random.txt', contents, {
    baseDir: BaseDirectory.AppData,
  });
}

function Levels() {
  const navigate = useNavigate();

  useEffect(() => {
    writeRandom();
  }, [])

  return <>
    <p>level select</p>
    <button onClick={() => navigate("/play")}>play</button>
  </>
} 

export default Levels
