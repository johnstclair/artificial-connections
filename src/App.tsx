import { load } from '@tauri-apps/plugin-store';
import GameScreen from "./components/GameScreen.tsx";
import Start from "./components/Start.tsx";
import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

async function writeModel(model: string) {
  const store = await load('settings.json', { autoSave: false });
  await store.set('model', { value: model } );
  const val = await store.get<{value: string}>('model');
  console.log(val);
  await store.save();
}

function App() {
  writeModel("test model")

  return (
      <Router>
          <Routes>
              <Route exact path="/" element={<Start />} />
              <Route path="/play" element={<GameScreen />} />
          </Routes>
      </Router>
  );
}

export default App;
