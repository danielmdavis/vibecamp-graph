
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 
// - Names in bars should be left-aligned - STUBBORN
// - Numbers should be centered - STUBBORN
// - work footer into mobile
// - keep perfecting it for mobile!
// - fonts not loading on first visit, FOUTing
// - add faces at right of bar (officially a goal but de facto dropped)

// LOGIC
// - why in the hell does animating date break the chart? WHY. WHY!!?
// - number of votes should also change during animation

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
