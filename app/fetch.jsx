
import fetch from 'node-fetch'

export default function getData() {

  const myHeaders = new Headers()
  // myHeaders.append('Authorization', 'Basic YWxpY2Vtb3R0b2xhQGdtYWlsLmNvbTpuZXJ2b3VzNm5lbGx5NA==')
  // myHeaders.append("Cookie", '_gt_persistent_session=6cddfb372bde63acc544298746360656')
  myHeaders.append('Authorization', 'Basic alicemottola@gmail.com:nervous6nelly4')

  const requestOptions = {
    method: 'GET',
    mode: 'no-cors',
    redirect: 'follow',
    headers: myHeaders
  }


  fetch('https://www.guidedtrack.com/programs/22568/csv', requestOptions)
  //   .then(response => response.text())
    .then((response) => { return response })
    .then(response => console.log(response))

    .then(response => { return response })
    .then(request => console.log(request))
    .then(result => console.log(result))
    .catch(error => console.log('error', error))
  


}