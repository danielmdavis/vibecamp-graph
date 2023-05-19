
import Graph from './graphComponent'
import { getData } from './fetch.jsx'

// TO DO
// if scores aren't capped, refactor scale as percentage of leader
// make csv data relevant
// check csv data for change, if change, write to db

export default async function Home() {
  
  let data: any
  do {
    data = await getData()
  } while (data === undefined) 

  return (
    <main>
      <Graph data={data}/>
    </main>
  )
  
}
