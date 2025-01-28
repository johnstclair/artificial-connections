import GameScreen from "./components/GameScreen.tsx";
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
              <Route exact path="/" element={<Start />} />
              <Route path="/play" element={<GameScreen />} />
          </Routes>
      </Router>
  );
}

export default App;
