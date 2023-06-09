
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 

// - Names in bars should be left-aligned - STUBBORN
// - Numbers should be centered - STUBBORN
// - fonts not loading on first visit - STUBBORN
// - update score total up to that point in pips during animation - uhoh
// - fix bg on mobile
// - remove the near-invisible line separating footer from body 
// - add faces at right of bar (de facto not happening)

// LOGIC

// - modify footer elements directly through vanilla js, bypass react

// - Try to show all contestants and stress-test with data 
// componentize data parsing (can be after event / for posterity)
// oppsec


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
