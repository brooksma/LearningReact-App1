import React from "react";

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

// Color Theme - the statuses of the numbers throughout the game
const colors = {
  available: "lightgray",
  used: "lightgreen",
  wrong: "lightcoral",
  candidate: "deepskyblue",
};

export default PlayNumber;
