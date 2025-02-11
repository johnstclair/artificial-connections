import { useNavigate } from "react-router-dom";

function Levels() {
  const navigate = useNavigate();

  return <>
    <p>level select</p>
    <button onClick={() => navigate("/play")}>play</button>
  </>
} 

export default Levels
