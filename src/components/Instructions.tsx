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
          <br/>
          <br/>
          First, download and install Ollama, as well as a model. Deepseek-R1:8B, or a more powerful reasoning model, is recommended for a stable playing experience. Other, lower resource intensive models will run and function, just not as well.
          <br/>
          <br/>
          To play the game, first select the model you will be using. Then select a level, the Premade Level is a good starting place to understand the mechanics. Once in game, click four words you think fit together well. Write the catagory you believe encompasses all of the words, and submit your selection. The LLM will "grade" your input and deem it a good catagory or not.
          <br/>
          <br/>
          If you want to create your own level, with custom words, navigate over to the Level Manager. When creating a level enter 16 words/phrases, each on a newline. Additionally, make sure to enter a name of the level.
          <br/>
          <br/>
          Please note, at the current state in the game, the AI does not always work as planned. I may try to fine tune a model for the game in the future, but for now, expect the game to function more as a proof of concept, which can (inconsistently) be fun, rather than a polished commercial game. Thanks! 
      </p>
    </div>
    <div className="middle-div">
      <button onClick={() => navigate("/")}>Back To Home</button>
    </div>
  </>
  );
}

export default Instructions;
