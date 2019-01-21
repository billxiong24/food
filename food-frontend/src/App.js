import React, { Component } from 'react';
import logo from './logo.svg';
import Button from '@material-ui/core/Button';
import ScollableTabsButtonAuto from './Components/ScrollableTabsButtonAuto'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        <ScollableTabsButtonAuto></ScollableTabsButtonAuto>   
      </div>
    );
  }
}

export default App;
