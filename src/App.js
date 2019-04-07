import React, { Component, Fragment } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import firebaseLogo from './images/FirebaseLogo.png';
import namecheapLogo from './images/NamecheapLogo.png';
import './App.css';
import {
  getIpAddress,
  getSavedData,
  saveData,
  isValidField,
  getCurrentTab,
  isValidURL,
  gatherInfo,
  getDomainAndTLD,
} from './utils';
import {
  getHosts,
} from './namecheapAPI';
import Error from './components/Error';
import ExistingHostsTable from './components/ExistingHostsTable';
import FirebaseRequirementsTable from './components/FirebaseRequirementsTable';

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
    currentTabUrl: '',
    gatheringInfo: false,
    values: [],
    makingGetHostsRequest: false,
    getHostsRequestError: null,
    hosts: null,
    apiKeyError: false,
  }

  componentDidMount() {
    let promises = [
      getIpAddress(),
      getSavedData(),
      getCurrentTab(),
    ];
    Promise.all(promises).then(values => {
      const [ipAddress, data = { namecheap: {} }, tab] = values;
      this.setState({ ipAddress, fetchingIPAddress: false, });
      const { username, apiKey } = data.namecheap;
      const savedCredentials = isValidField(username) && isValidField(apiKey);
      if (savedCredentials) {
        this.setState({ username, apiKey });
      }
      this.setState({ data, fetchingData: false, savedCredentials });
      this.setState({ currentTabUrl: tab.url });
      if (isValidURL(tab.url)) {
        this.setState({ gatheringInfo: true });
        gatherInfo(this.processValues);
      }
    })
  }

  processGetHostsResponse = (xmlDoc) => {
    const hosts = xmlDoc.getElementsByTagName('host') || []
    const errors = xmlDoc.getElementsByTagName('Error') || [];
    if (errors && errors.length > 0) {
      this.setState({ getHostsRequestError: errors[0] });
      if (errors[0].innerHTML.includes('API Key is invalid or API access has not been enabled')) {
        this.setState({ viewCredentials: true, apiKeyError: true });
      }
    } else {
      const hostValues = [];
      for (let host of hosts) {
        var currentHost = {};
        var attributes = host.attributes;
        for (var j = 0; j < attributes.length; j++) {
          currentHost[attributes[j].nodeName] = attributes[j].nodeValue;
        }
        hostValues.push(currentHost);
      }
      this.setState({ hosts: hostValues });
    }
    this.setState({ makingGetHostsRequest: false });
  }

  processValues = (values = []) => {
    this.setState({ gatheringInfo: false, values })
    if (values.length > 0 && values[0].length > 0) {
      const { domain, tld } = getDomainAndTLD(values[0][0].host.replace(' help_outline', ''));
      const { username, apiKey, ipAddress } = this.state;
      this.setState({ makingGetHostsRequest: true });
      const params = { username, apiKey, ipAddress, domain, tld };
      getHosts(params).then(this.processGetHostsResponse);
    }
  }

  handleChange = name => event => {
    if (name === 'apiKey') {
      this.setState({ apiKeyError: false });
    }
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
    const { username, apiKey, apiKeyError } = this.state;
    return (
      <Fragment>
        <TextField label="Username" onChange={this.handleChange('username')} value={username} />
        <br/>
        <br/>
        <TextField
          label="API Key"
          onChange={this.handleChange('apiKey')}
          value={apiKey}
          error={apiKeyError}
        />
        <br/>
      </Fragment>
    );
  }

  saveButton = (savingData) => (
    <Button variant="contained" color="primary" disabled={savingData} onClick={this.onSaveClicked}>
      {savingData ? 'Saving' : 'Save'}
    </Button>
  )

  renderIntro = () => {
    const { savedCredentials, fetchingData, savingData } = this.state;
    return fetchingData ? null : (
      <div>
        {savedCredentials ? null : (
          <div className="intro-div">
            <p>Please enter your Namecheap username and API key here.</p>
            <p>API Access must first be requested, which can be done <a href="https://ap.www.namecheap.com/settings/tools/apiaccess">here</a>.</p>
            {this.credentialsInputs()}
            {this.saveButton(savingData)}
          </div>
        )}
      </div>
    );
  }

  renderCredentials = () => {
    const { savedCredentials, viewCredentials, credentialsChanged, savingData } = this.state;
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
            <br/>
            <Button variant="outlined" color="secondary">
              Delete
            </Button>
            {credentialsChanged && this.saveButton(savingData)}
          </div>
        )}
      </div>
    ) : null;
  }

  renderRecordTypesTable = (values) => {
    const { makingGetHostsRequest, getHostsRequestError, hosts } = this.state;
    return (!makingGetHostsRequest && getHostsRequestError) ? (
      <Error message={getHostsRequestError.innerHTML} />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <h3>The values Firebase wants you to add</h3>
        <FirebaseRequirementsTable values={values} />
        <br/>
        <h3>The A-record values Namecheap already has for this domain of yours</h3>
        <ExistingHostsTable hosts={hosts} makingGetHostsRequest={makingGetHostsRequest} />
      </div>
    );
  }

  renderSpecificModalInstructions = () => {
    const { gatheringInfo, values } = this.state;
    return gatheringInfo ? (
      <div>
        <p>Loading...</p>
      </div>
    ) : (
      <div>
        {values.length > 0 && values[0].length > 0 ? this.renderRecordTypesTable(values) : (
          <p>Looks like you're on the right url, but you must click on the blue "View" button within the domains table</p>
        )}
      </div>
    );
  }

  render() {
    const { currentTabUrl } = this.state;
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
        {isValidURL(currentTabUrl) ? (
          <Fragment>
            {this.renderIntro()}
            <br/>
            {this.renderCredentials()}
            <br/>
            {this.renderSpecificModalInstructions()}
          </Fragment>
        ) : (
          <div>
            <p>You are currently on the url {currentTabUrl}, but this extension is only intended to work on URLs in this format:</p>
            <br/>
            <span>{"https://console.firebase.google.com/u/<number>/project/<project-id>/hosting/sites/<project-id>"}</span>
          </div>
        )}
      </div>
    );
  }
}

export default App;
