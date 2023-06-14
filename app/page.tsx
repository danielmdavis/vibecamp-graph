
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 



// - size down bg image to load faster
// - history button isn't updating when the animation updates
// - could you make the interval in the setTimeout for the animation a little longer? I feel like it goes too fast? 
// - why is final step in animation janky
// - style phone button - kiss
// - more padding everywhere on browser
// - right now we're at 1212 points with only 1.6% of vc having voted. is that number going to get insanely huge / visually ungovernable?
// - compress phone view vertically (more?)
// - STUBBORN - Names in bars should be left-aligned

// LOGIC

// - change how total votes is calculated!
// - dates not writing to db!!! (clock is ticking)
// - Try to show all contestants and stress-test with data 

// - componentize data parsing (can be after event / for posterity)
// - oppsec

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
