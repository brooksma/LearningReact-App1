import React, { useEffect, useState } from "react";
import utils from "../Math-Utils";
import PlayAgain from "./PlayAgain.js";
import PlayNumber from "./PlayNumber.js";
import StarsToDisplay from "./StarsToDisplay.js";

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

// This single component is responsible foe rendering
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

export default Game;
