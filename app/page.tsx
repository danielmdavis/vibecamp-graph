
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO
// if scores aren't capped, refactor scale as percentage of leader ?
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
