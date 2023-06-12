
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 

// - STUBBORN - update score total up to that point in pips during animation
// - STUBBORN - Names in bars should be left-aligned
// - STUBBORN - Numbers should be centered
// - STUBBORN - fonts not loading on first visit
// - STUBBORN - remove the near-invisible line separating footer from body
// - (de facto scrapped) - add faces at right of bar

// LOGIC

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
