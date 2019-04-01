/* global chrome */

export const getSavedData = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('namecheap', data => {
      resolve(data);
    });
  });
}

export const saveData = (data, cb) => {
  console.log('saveData called here with data:');
  console.dir(data);
  chrome.storage.sync.set({ namecheap: data }, cb)
}

export const isValidField = (field) => field && field.length > 0;

export const getIpAddress = () => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
      var jsonResponse = xhr.response;
      console.log('jsonResponse.ip: ' + jsonResponse.ip);
      resolve(jsonResponse.ip);
    }
    xhr.open("GET", "https://api.ipify.org?format=json", true);
    xhr.send();
  })
}

export const makeApiRequest = ({ username, apiKey, ipAddress, domain, tld }) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.responseXML);
      }
    }
    const url = `https://api.namecheap.com/xml.response?ApiUser=${username}&ApiKey=${apiKey}&UserName=${username}&ClientIp=${ipAddress}&Command=namecheap.domains.dns.getHosts&SLD=${domain}&TLD=${tld}`;
    xhr.open("GET", chrome.extension.getURL(url), true);
    xhr.send();
  });
}

export const getCurrentTab = () => {
  return new Promise((resolve, reject) => {
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query, tabs => {
      resolve(tabs[0]);
    });
  })
}

export const isValidURL = (url) => {
  return url.includes('console.firebase.google.com/u/') && url.includes('/hosting/sites/');
}

export const ROW_SELECTOR = 'md-dialog > div.h5g-dialog-connect-domain-scroll-container > h5g-verify-ssl > div.h5g-verify-ssl-quick-steps > table > tbody > tr';

export const modifyDOM = () => {
  let matches = document.querySelectorAll(ROW_SELECTOR);
  let values = [];
  matches.forEach((value, key) => {
    let recordType = value.cells[0].textContent.trim();
    let host = value.cells[1].textContent.trim();
    let rowValue = value.cells[2].textContent.trim();
    let entry = { recordType, host, value: rowValue };
    values.push(entry);
  });
  return values;
}

export const gatherInfo = (cb) => {
  chrome.tabs.executeScript({
    code: '(' + modifyDOM + ')();'
  }, cb);
}

export const getDomainAndTLD = (host) => {
  const parts = host.split('.');
  const tld = parts[parts.length - 1];
  const domain = parts[parts.length - 2];
  return { domain, tld };
}

/*
to be put in makeApiRequest promise.then call:
var xmlDoc = xhr.responseXML;
var hosts = xmlDoc.getElementsByTagName('Host')
var hostValues = [];
for (var i = 0; i < hosts.length; i++) {
  var currentHost = {};
  var attributes = hosts[i].attributes;
  for (var j = 0; j < attributes.length; j++) {
    currentHost[attributes[j]] = hosts[i].getAttribute(attributes[j])
  }
  hostValues.push(currentHost);
  console.log('for host ' + i + ': ');
  console.dir(currentHost);
}
document.getElementById('makeCallButton').setAttribute('disabled', false)
document.getElementById('makeCallButton').innerText = 'Make API Call!'

*/