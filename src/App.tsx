import GameScreen from "./components/GameScreen.tsx";
import Instructions from "./components/Instructions.tsx";
import Levels from "./components/Levels.tsx";
import Start from "./components/Start.tsx";
import LevelManager from "./components/LevelManager.tsx";
import Win from "./components/Win.tsx";
import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/play" element={<GameScreen />} />
              <Route path="/levels" element={<Levels />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/manager" element={<LevelManager />} />
              <Route path="/win" element={<Win />} />
          </Routes>
      </Router>
  );
}

export default App;
