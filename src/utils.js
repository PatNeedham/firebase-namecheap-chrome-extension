/* global chrome */

export const getSavedData = (cb) => {
  chrome.storage.sync.get('namecheap', cb);
}

export const saveData = (data, cb) => {
  chrome.storage.sync.set({ namecheap: data }, cb)
}

export const getIpAddress = (cb) => {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.onload = function() {
    var jsonResponse = xhr.response;
    console.log('jsonResponse.ip: ' + jsonResponse.ip);
    cb(jsonResponse.ip);
  }
  xhr.open("GET", "https://api.ipify.org?format=json", true);
  xhr.send();
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