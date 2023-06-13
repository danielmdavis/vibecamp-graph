
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO

// UI 

// - why is final step in animation janky
// - style phone button
// - compress phone view vertically (more?)
// - STUBBORN - Names in bars should be left-aligned

// LOGIC

// - dates not writing to db!
// - fix total score in footer offset!
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
