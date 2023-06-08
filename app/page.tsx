
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 
// - Names in bars should be left-aligned - STUBBORN
// - Numbers should be centered - STUBBORN
// - keep perfecting it for mobile!
// fonts not loading on first visit, FOUTing
// - add faces at right of bar (officially a goal but de facto dropped)

// LOGIC
// - why in the hell does animating date break the chart? WHY
// - number of votes of votes should also change during animation
// - Change “99 votes cast” to “12 votes cast (99 points total)” (how does this work visually?)
// - Try to show all contestants and stress-test with data 
// componentize data parsing (can be for posterity / after event)


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
