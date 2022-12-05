import React, { useState } from "react";
import "./App.css";
import Game from "./Components/Game.js";

// STAR MATCH - Starting Template provided at https://jscomplete.com/playground/rgs3.1
// TIP:
// - when trying to optimize code, try to do map/filter/reduce methods over for/while loops
// - when ever you have an element that is going to be used in the UI and is going to change value, you should make it a state element
// - if items share similar data or behavior, that makes them a good candidate to be their own component
//      ex) the play numbers in this game all have the same behavior
// - start identifying when closures are being used in function components - not understanding them can lead to bugs
// - State elements should use the MINIMUM amount of data possible to describe all states
// - component props should be exact, only the information that is needed to render the component should be passed down, nothing else
// - Component structure - Hooks - Computational values
// - useEffect Hook - if you create an effect it should always clean up after it'self

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  // using the Key identifier, we can create new components of Game that will each be their own instance of the game
  // React will un-mount & remove all the side effects of the old game with the prev key
  // and mount a NEW component, which will re-create all of the elements
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />;
};

class BaseComponent extends React.Component {
  state = {};
  // render function is the only required function for a React Component
  // it returns the virtual DOM description of the component
  render() {
    return (
      <div className="app">
        <div className="header">{this.props.title}</div>
        <StarMatch />
      </div>
    );
  }
}

function App() {
  return <BaseComponent title="Madison's First React App" />;
}

export default App;
