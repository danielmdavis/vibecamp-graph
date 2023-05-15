
// import { Curl as Curly } from 'node-libcurl'
import querystring from 'querystring'


// export default function Curl() {

//   const curl = new (Curly as any)()
//   const terminate = curl.close.bind(curl)
//   console.log(Curl)

//   curl.setOpt(Curl.option.URL, 'https://www.guidedtrack.com/programs/22568/csv')
//   curl.setOpt(Curl.option.HTTPHEADER, ['Authorization: Basic alicemottola@gmail.com:nervous6nelly4'])
  
//   curl.on("end", function (statusCode:any, data: any, headers: any) {
//     console.info(statusCode)
//     console.info(data)
//     this.close()
//   })
//   curl.on("error", terminate)
//   curl.perform()
// }