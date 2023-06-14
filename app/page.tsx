
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 

// - compress phone view vertically (more?)
// - will score total become visually ungovernable?
// - STUBBORN - Names in bars should be left-aligned

// LOGIC

// - change how total votes is calculated! ( or... 😈 )
// - dates not writing to db!!! (clock is ticking)

// - componentize data parsing (can be after event / for posterity)

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
