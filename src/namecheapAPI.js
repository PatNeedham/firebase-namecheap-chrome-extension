/* global chrome */

export const makeApiRequest = ({ username, apiKey, ipAddress, domain, tld, Command }) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.responseXML);
      }
    }
    const endpoint = 'https://api.namecheap.com/xml.response';
    const qs = `ApiUser=${username}&ApiKey=${apiKey}&UserName=${username}&ClientIp=${ipAddress}&Command=${Command}&SLD=${domain}&TLD=${tld}`;
    const url = `${endpoint}?${qs}`;
    xhr.open("GET", chrome.extension.getURL(url), true);
    xhr.send();
  });
}

export const getHosts = (params) => makeApiRequest(
  {
    ...params,
    Command: 'namecheap.domains.dns.getHosts'
  }
);

export const setHosts = (params) => makeApiRequest(
  {
    ...params,
    Command: 'namecheap.domains.dns.setHosts'
  }
);