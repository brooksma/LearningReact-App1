import React from "react";
import "./App.css";

class BaseComponent extends React.Component {
  state = {};
  // render function is the only required function for a React Component
  // it returns the virtual DOM description of the component
  render() {
    return <div className="app"></div>;
  }
}

function App() {
  return <BaseComponent title="Madison's First React App" />;
}

export default App;
