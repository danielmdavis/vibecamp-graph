
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO
// formatting for mobile - URGENT
// only show top n% of people
// fonts not loading on first visit and FOUTing

// more styling
// explanatory tooltip - somewhere. maybe outside the computer
// scalar score assignment?
// componentize data parsing

export default async function Home() {
  

  let data: any
  do {
    data = await getData()
    data = Papa.parse(data, {
      header: true
    })

  } while (data === undefined) 


  return (
    <main>
      <Graph data={data}/>
    </main>
  )
  
}
