import GameScreen from "./components/GameScreen.tsx";
import Instructions from "./components/Instructions.tsx";
import Start from "./components/Start.tsx";
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
              <Route path="/instructions" element={<Instructions />} />
          </Routes>
      </Router>
  );
}

export default App;
