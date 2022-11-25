import axios from "axios";
import React from "react";
import "./App.css";

const CardList = (props) => (
  <div className="flex-wrap">
    {/* Mapping the testData object into React Components, 
      this returns an array of card components that then get rendered in the DOM*/}
    {props.profiles.map((profile) => (
      <CardComponent key={profile.id} {...profile} />
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
          <div style={{ fontWeight: "bold" }}>{profile.login}</div>
          <div>{profile.company}</div>
        </div>
      </div>
    );
  }
}

/* Input Notes:
    For reading in user input, it can also be done by reference:
      usernameInput = React.createRef();
      handleSubmit = (event) => {
        event.preventDefault(); // prevent re-loading of the page ? the instructor mentioned that but that seems so strange
        console.log(this.usernameInput.current.value); // reading the value by reference
      };
      render(){return <input ref={this.usernameInput}></input>}

   The code below is using (known as two way binding in Angular) to set a state component for the element,
      react is now controlling that element so we need to add the onChange event
      We are managing the state of the class component
    What is the benefit of having it this way instead of by reference? 
      React is aware of every change as the user is typing, this can provide while typing information to the user
      I myself can see this valuable when setting a password and prompting the user of the requirements
      Or as mentioned by the instructor, the count of characters if there is a limit
    OVERVIEW:
        We are controlling the element through React and not through the DOM to have more control and information over the element.
        There is nothing wrong with referencing the DOM if you do not need react to read that data.
*/

class Form extends React.Component {
  state = { usernameInput: "" };
  handleSubmit = async (event) => {
    event.preventDefault(); // prevent re-loading of the page ? the instructor mentioned that but that seems so strange
    console.log(this.state.usernameInput);
    // API endpoint -  enhancement would be making a service (that only makes axios calls)
    const rsp = await axios.get(
      `https://api.github.com/users/${this.state.usernameInput}`
    );
    this.props.onSubmit(rsp.data);
    // since we are controlling the state of the component we need to set the input
    // back to empty string after the user clicks submit :)
    this.setState({ usernameInput: "" });
  };
  render() {
    return (
      <div style={{ justifyContent: "right", display: "flex", width: "98%" }}>
        <p style={{ margin: "15px" }}>
          Check out this website for a full list: https://api.github.com/users/
          <br />
          <br />
          Add new login usernames to add users to the page.
        </p>
        <form className="form" onSubmit={this.handleSubmit}>
          <input
            className="form-input"
            type="text"
            placeholder="GitHub Username"
            // enhancement to extract this management of the state into it's own component as well
            // this would greatly simplify this component
            onChange={(event) =>
              this.setState({ usernameInput: event.target.value })
            }
            value={this.state.usernameInput}
            required
          ></input>
          <button className="form-button">Add Card</button>
        </form>
      </div>
    );
  }
}

class BaseComponent extends React.Component {
  state = {
    profiles: [], //testData,
  };
  addNewProfile = (profileData) => {
    console.log("App", profileData);
    this.setState((prevState) => ({
      // concat on the profiles obj list
      profiles: [...prevState.profiles, profileData],
    }));
  };
  // render function is the only required function for a React Component
  // it returns the virtual DOM description of the component
  render() {
    return (
      <div className="app">
        <div className="header">{this.props.title}</div>
        <Form onSubmit={this.addNewProfile} />
        <CardList profiles={this.state.profiles} />
      </div>
    );
  }
}

function App() {
  return <BaseComponent title="Madison's First React App" />;
}

export default App;
