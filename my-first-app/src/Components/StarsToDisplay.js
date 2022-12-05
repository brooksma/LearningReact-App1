import React from "react";
import utils from "../Math-Utils";

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

export default StarsToDisplay;
