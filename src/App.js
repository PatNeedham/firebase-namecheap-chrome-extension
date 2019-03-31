import React, { Component } from 'react';
import logo from './logo.svg';
import firebaseLogo from './images/FirebaseLogo.png';
import namecheapLogo from './images/NamecheapLogo.png';
import './App.css';
import { getIpAddress } from './utils';

class App extends Component {
  state = {
    ipAddress: null,
    fetchingIPAddress: true,
  }

  componentDidMount() {
    getIpAddress(ipAddress => {
      this.setState({ ipAddress, fetchingIPAddress: false, });
    })
  }
  render() {
    const { ipAddress, fetchingIPAddress } = this.state;
    return (
      <div className="App">
        <header>
          <div className="top-row">
            <img src={firebaseLogo} className="logo" alt="Firebase Logo" />
            <span style={{ paddingLeft: 20, paddingRight: 20 }}>X</span>
            <img src={namecheapLogo} className="logo" alt="Namecheap Logo" />
            <span style={{ paddingLeft: 10 }}> = awesome</span>
          </div>
          <p>
            {"Welcome to the Firebase Hosting <-> Namecheap DNS Chrome Extension"}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <div>
          <p>Your IP Address:</p>
          {fetchingIPAddress ? 'Loading' : ipAddress}
        </div>
      </div>
    );
  }
}

export default App;
