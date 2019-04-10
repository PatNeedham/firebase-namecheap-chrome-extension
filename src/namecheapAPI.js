/* global chrome */

export const makeApiRequest = (params) => {
  const { Method = "GET" } = params;
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.responseXML);
      }
    }
    const endpoint = 'https://api.namecheap.com/xml.response';
    const qs = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    // const qs = `ApiUser=${ApiUser}&ApiKey=${ApiKey}&UserName=${UserName}&ClientIp=${ClientIp}&Command=${Command}&SLD=${SLD}&TLD=${TLD}`;
    const url = `${endpoint}?${qs}`;
    xhr.open(Method, chrome.extension.getURL(url), true);
    xhr.send();
  });
}

export const getHosts = (params) => makeApiRequest(
  {
    ...params,
    Command: 'namecheap.domains.dns.getHosts'
  }
);

export const setHosts = (params) => {
  const { ApiUser, UserName, ApiKey, ClientIp, SLD, TLD, hosts, values, subdomain } = params;
  const finalParams = {
    ApiUser,
    UserName,
    ApiKey,
    ClientIp,
    SLD,
    TLD,
    Command: 'namecheap.domains.dns.setHosts',
    Method: 'POST',
  };
  hosts.forEach(({ Name, Type, Address, MXPref }, i) => {
    finalParams[`HostName${i + 1}`] = Name;
    finalParams[`RecordType${i + 1}`] = Type;
    finalParams[`Address${i + 1}`] = Address;
    if (Type === 'MX') {
      finalParams[`MXPref${i + 1}`] = MXPref;
      console.log('for this MX record, remaining params are: ');
      console.dir(params);
    }
  })
  values[0].forEach(({ Name, recordType, value }, i) => {
    finalParams[`HostName${hosts.length + i + 1}`] = subdomain;
    finalParams[`RecordType${hosts.length + i + 1}`] = recordType;
    finalParams[`Address${hosts.length + i + 1}`] = value.replace(' content_copy', '').replace(/\s/g,'');
  });
  console.log(`would call makeApiRequest with these final params: \n${JSON.stringify(finalParams, null, 2)}`);
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 3000);
  // });
  return makeApiRequest(finalParams);
};
