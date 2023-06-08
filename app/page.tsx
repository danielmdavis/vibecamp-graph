
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 
// - Names in bars should be left-aligned - STUBBORN
// - Numbers should be centered - STUBBORN
// - fonts not loading on first visit - STUBBORN
// - fix bg on mobile
// - add faces at right of bar (de facto not happening)

// LOGIC
// - why in the hell does animating date break the chart? WHY. WHY!!?
// - number of votes should also change during animation

// - Try to show all contestants and stress-test with data 
// componentize data parsing (can be after event / for posterity)


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
