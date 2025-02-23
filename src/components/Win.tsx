import { useNavigate } from "react-router-dom";

function Instructions() {
  const navigate = useNavigate();

  return (
  <>
    <div className="name">
      <h3>You won!</h3>
    </div>
    <div className="middle-div">
      <p className="instructions">
          Good job!
      </p>
    </div>
    <div className="middle-div vertical-align">
      <button onClick={() => navigate("/")}>Back To Home</button>
    </div>
  </>
  );
}

export default Instructions;
