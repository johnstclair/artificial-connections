import { useNavigate } from "react-router-dom";

function Instructions() {
  const navigate = useNavigate();

  return (
  <>
    <div className="name">
      <h3>How to Play</h3>
    </div>
    <div className="middle-div">
      <p className="instructions">
          This game plays a lot like Connections by New York Times; however, I've followed the one of the current tech trends and added AI.
      </p>
    </div>
    <div className="middle-div">
      <button onClick={() => navigate("/")}>Back To Home</button>
    </div>
  </>
  );
}

export default Instructions;
