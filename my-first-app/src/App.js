import React, { useEffect, useState } from "react";
import "./App.css";

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

// Custom Hooks should always be named with the key work use in the front
// this custom hook is managing the state of the game - and they are returned for the game to use
const useGameState = (timeLimit) => {
  // These elements below will be updated and honored within the UI's view
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  // Hook
  // React.useEffect - a way to introduce a side effect for the component
  // When component is DONE rendering  this code will run
  // WHEN ANY part of the related DOM is rendered this code wil be run
  useEffect(() => {
    // because there is a loop (as described below)
    // we need this exit condition
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        // using setState - which will re-render the screen
        //  re-rendering the screen then re-calls the useEffect
        //  AND SO we created a loop
        setSecondsLeft(secondsLeft - 1);
      }, 1000);

      // Here the component is going to re-render (catching it before)
      // code here can be used as clean up
      // if you create an effect it should always clean up after it'self
      // we are ensuring there are no timer conflicts BUT this does create an interesting
      // bug in the code where the user can cheat if they quickly click the same button over and over
      return () => clearTimeout(timerId);
    }
  });

  const setGameState = (newCandidateNums) => {
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        (n) => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };

  // returns all of the objects that the game needs - now not bothered with the state changes
  return { stars, availableNums, candidateNums, secondsLeft, setGameState };
};

// This single component is responsible for both rendering and doing state logic
const Game = (props) => {
  const { stars, availableNums, candidateNums, secondsLeft, setGameState } =
    useGameState();

  // sum of the numbers the user selected is greater than the amount of stars
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  // making this a variable creates more readable code - even though this line is simple
  const gameStatus =
    availableNums.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "active";

  // const resetGame = () => {
  //   setStars(utils.random(1, 9));
  //   setAvailableNums(utils.range(1, 9));
  //   setCandidateNums([]);
  // };

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      // if the number is not in the available numbers array
      return "used";
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? "wrong" : "candidate";
    }
    return "available"; // not used, not candidate
  };

  const onNumberClick = (number, currentStatus) => {
    // from child - props.number, props.status

    // start with the 'easy' weed out logic items

    // if the number is used - nothing else can happen
    if (gameStatus !== "active" || currentStatus === "used") {
      return;
    }

    //
    const newCandidateNums =
      currentStatus === "available"
        ? candidateNums.concat(number)
        : candidateNums.filter((cn) => cn !== number);

    setGameState(newCandidateNums);
    // MOVING out of here (into useGameState) as this code is editing the state
    // // do we have an exact pick amount?
    // if (utils.sum(newCandidateNums) !== stars) {
    //   // we do not have a correct answer
    //   setCandidateNums(newCandidateNums);
    // } else {
    //   // we have a correct pic! we need to update the lists

    //   // set the new available numbers to remove the numbers that the candidate chose
    //   const newAvailableNums = availableNums.filter(
    //     (n) => !newCandidateNums.includes(n)
    //   );
    //   // re-draw the number of stars - but only within what is available for the user to select
    //   //  (in-order to create a game that is possible to win)
    //   setStars(utils.randomSumIn(newAvailableNums, 9));
    //   setAvailableNums(newAvailableNums);
    //   setCandidateNums([]);
    // }
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== "active" ? (
            // OLD onClick called {resetGame} - now we are mounting a new game component
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
            // {/* Flow down the amount of starts that needs to be printed */}
            <StarsToDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map((number) => (
            // Key is needed on the immediate element of the list
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  // using the Key identifier, we can create new components of Game that will each be their own instance of the game
  // React will un-mount & remove all the side effects of the old game with the prev key
  // and mount a NEW component, which will re-create all of the elements
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />;
};

const StarsToDisplay = (props) => (
  // every react component needs to render a single element
  // and to do this without more HTML elements
  // we can add in a React Fragment - empty jsx tag
  <>
    {utils.range(1, props.count).map((starId) => (
      <div key={starId} className="star" />
    ))}
  </>
);

const PlayNumber = (props) => (
  // Javascript Closures - each on click method closes over the play number scope and gives us access to it's props
  //  we have nine onClick handlers and they all have different closures, closing over different scopes
  <button
    className="number"
    // passing new property to this component that then works with the colors obj to determine the color
    style={{ backgroundColor: colors[props.status] }}
    // onClick invoke the behavior that is defined within the parent component
    onClick={() => props.onClick(props.number, props.status)}
  >
    {props.number}
  </button>
);

const PlayAgain = (props) => (
  <div className="game-done">
    <div
      className="message"
      style={{ color: props.gameStatus === "lost" ? "red" : "green" }}
    >
      {props.gameStatus === "lost" ? "Game Over" : "Nice"}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

// Color Theme - the statuses of the numbers throughout the game
const colors = {
  available: "lightgray",
  used: "lightgreen",
  wrong: "lightcoral",
  candidate: "deepskyblue",
};

// Math science - vanilla javascript that can be utilized by React - but this is not considered React code
const utils = {
  // Sum an array
  sum: (arr) => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
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
