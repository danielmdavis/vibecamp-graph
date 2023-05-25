
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO
// componentize data parsing
// score on bars ?
// scalar score assignment?
// general reform to use of space
// dates for history / current
// explanatory tooltip - somewhere. maybe outside the computer
// why is the animation being mildly screwy -_-

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
