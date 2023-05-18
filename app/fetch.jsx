import fetch from 'node-fetch'

export default function getData() {

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YWxpY2Vtb3R0b2xhQGdtYWlsLmNvbTpuZXJ2b3VzNm5lbGx5NA==");
  myHeaders.append("Cookie", "_gt_persistent_session=7f0a6c5e9b4e6646b428f7326d27dbef");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    cache: 'no-store'
  };

  return fetch("https://www.guidedtrack.com/programs/22568/csv", requestOptions)
    .then(response => response.text())
    .then(result => { return result })
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));

}