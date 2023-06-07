
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 
// - Names in bars should be left-aligned 
// - Numbers should be centered 
// - “Vote to send 3 vibecampers to the dating show, where they’ll compete for the heart of vibecamp’s hottest bachelorette.”

// LOGIC
// - Try to show all contestants and stress-test with data 
// - Dates and # of votes should change as the historical animation progresses 
// - Change “99 votes cast” to “12 votes cast (99 points total)”

// clean it up for mobile!

// add faces at right of bar
// fonts not loading on first visit, and FOUTing

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
