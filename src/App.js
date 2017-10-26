import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.props.heading}</h1>
        </header>
        <p className="App-intro">
          {this.props.children}
        </p>
      </div>
    );
  }
}

App.propTypes = {
  heading: PropTypes.string.isRequired
};

export default App;
