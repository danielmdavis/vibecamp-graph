
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 

// - phone animation controlled by button rather than full screen
// - compress phone view vertically
// - remove rainbow bg on phone
// - *** - scale pip size with total score!

// - STUBBORN - fonts not loading on first visit
// - STUBBORN - remove the near-invisible line separating footer from body
// - STUBBORN - update score total up to that point in pips during animation
// - STUBBORN - Names in bars should be left-aligned
// - STUBBORN - Numbers should be centered
// - (de facto scrapped) - add faces at right of bar

// LOGIC

// - DATES NOT POSTING. see firebase error saying data is undefined
// - fix short history having poor animation timing!
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
