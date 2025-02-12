import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exists, mkdir, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

async function writeRandom() {
  const levelsExist = await exists('levels', {
    baseDir: BaseDirectory.AppData,
  });
  if (!levelsExist) { 
    await mkdir('levels', {
      baseDir: BaseDirectory.AppData,
    });
  }

  const contents = "extra\nball\nwon\nmug\npin\ncopy\ntoo\ntee\nate\nspare\npen\nlane\nalley\ntote\nfor\nbackup"
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
