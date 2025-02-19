import { useNavigate } from "react-router-dom";

function Instructions() {
  const navigate = useNavigate();

  return (
  <div className="middle-div">
    <button onClick={() => navigate("/")}>Back To Home</button>
  </div>
  );
}

export default Instructions;
