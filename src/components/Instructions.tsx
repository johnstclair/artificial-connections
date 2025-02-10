import { useNavigate } from "react-router-dom";

function Instructions() {
  const navigate = useNavigate();

  return (
  <button onClick={() => navigate("/")}>back to home</button>
  );
}

export default Instructions;
