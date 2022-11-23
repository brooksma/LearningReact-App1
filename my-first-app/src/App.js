import React from "react";
import "./App.css";

class GitHubCards extends React.Component {
  // render function is the only required function for a React Component
  // it returns the virtual DOM description of the component
  render() {
    return <div className="App-header">{this.props.title}</div>;
  }
}

// Defining the same thing but with a variable
// const GitHubCards = ({ title }) => <div className="App-header">{title}</div>;

function App() {
  return <GitHubCards title="Madison's First React App" />;
}

export default App;
