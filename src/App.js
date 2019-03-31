import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import firebaseLogo from './images/FirebaseLogo.png';
import namecheapLogo from './images/NamecheapLogo.png';
import './App.css';
import { getIpAddress, getSavedData, saveData, isValid } from './utils';

class App extends Component {
  state = {
    ipAddress: null,
    fetchingIPAddress: true,
    data: {},
    fetchingData: true,
    savingData: false,
    username: '',
    apiKey: '',
    savedCredentials: false,
    viewCredentials: false,
    credentialsChanged: false,
  }

  componentDidMount() {
    getIpAddress(ipAddress => {
      this.setState({ ipAddress, fetchingIPAddress: false, });
    });
    getSavedData((data = { namecheap: {} }) => {
      const { username, apiKey } = data.namecheap;
      const savedCredentials = isValid(username) && isValid(apiKey);
      if (savedCredentials) {
        this.setState({ username, apiKey });
      }
      this.setState({ data, fetchingData: false, savedCredentials });
    });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value, credentialsChanged: true });
  }

  onSaveClicked = () => {
    const { username, apiKey } = this.state;
    this.setState({ savingData: true });
    const data = {
      username,
      apiKey,
    }
    saveData(data, () => {
      this.setState({ savingData: false, credentialsChanged: false });
    });
  }

  toggleViewCredentials = () => this.setState({ viewCredentials: !this.state.viewCredentials });

  credentialsInputs = () => {
    const { username, apiKey } = this.state;
    return (
      <Fragment>
        <TextField label="Username" onChange={this.handleChange('username')} value={username} />
        <br/>
        <br/>
        <TextField label="API Key" onChange={this.handleChange('apiKey')} value={apiKey} />
        <br/>
      </Fragment>
    );
  }

  renderIntro = () => {
    const { savedCredentials, fetchingData, savingData } = this.state;
    return fetchingData ? null : (
      <div>
        {savedCredentials ? null : (
          <div className="intro-div">
            <p>Please enter your Namecheap username and API key here.</p>
            <p>API Access must first be requested, which can be done <a href="https://ap.www.namecheap.com/settings/tools/apiaccess">here</a>.</p>
            {this.credentialsInputs()}
            <Button variant="contained" color="primary" disabled={savingData} onClick={this.onSaveClicked}>
              {savingData ? 'Saving' : 'Save'}
            </Button>
          </div>
        )}
      </div>
    );
  }
  renderCredentials = () => {
    const { savedCredentials, viewCredentials } = this.state;
    return savedCredentials ? (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.toggleViewCredentials}
        >
          {viewCredentials ? 'Hide credentials' : 'View Credentials'}
        </Button>
        <br/>
        <br/>
        {viewCredentials && (
          <div className="intro-div">
            {this.credentialsInputs()}
          </div>
        )}
      </div>
    ) : null;
  }
  render() {
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
        </header>
        {this.renderIntro()}
        {this.renderCredentials()}
      </div>
    );
  }
}

export default App;
