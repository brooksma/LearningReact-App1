import React from "react";
import "./App.css";
import testData from "./TestData";

const CardList = (props) => (
  <div className="flex-wrap">
    {/* Mapping the testData object into React Components, 
      this returns an array of card components that then get rendered in the DOM*/}
    {testData.map((profile) => (
      <CardComponent {...profile} />
    ))}
    {/* The code below will do the job one at a time but that is not what we want
    <CardComponent {...testData[0]} />
    */}
  </div>
);

// Note that for simplicity the classes are all being defined within this one file :) I do want to break this out
class CardComponent extends React.Component {
  render() {
    const profile = this.props;
    return (
      <div className="card">
        <img src={profile.avatar_url} alt="profile"></img>
        <div className="info">
          {/* Below is an example of in-line styling
                NOTE: it needs to be treated like an object
                https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
          */}
          <div style={{ fontWeight: "bold" }}>{profile.name}</div>
          <div>{profile.company}</div>
        </div>
      </div>
    );
  }
}

class Form extends React.Component {
  usernameInput = React.createRef();
  handleSubmit = (event) => {
    event.preventDefault(); // prevent re-loading of the page ? the instructor mentioned that but that seems so strange
    console.log(this.usernameInput.current.value);
  };
  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <input
          className="form-input"
          type="text"
          placeholder="GitHub Username"
          ref={this.usernameInput}
          required
        ></input>
        <button className="form-button">Add Card</button>
      </form>
    );
  }
}

class BaseComponent extends React.Component {
  // render function is the only required function for a React Component
  // it returns the virtual DOM description of the component
  render() {
    return (
      <div className="app">
        <div className="header">{this.props.title}</div>
        <Form />
        <CardList />
      </div>
    );
  }
}

function App() {
  return <BaseComponent title="Madison's First React App" />;
}

export default App;
