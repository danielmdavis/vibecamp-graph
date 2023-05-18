
import Graph from './graphComponent'
import getData from './fetch.jsx'

// TO DO
// if scores aren't capped, refactor scale as percentage of leader
// implement pull from external api and write to db

export default async function Home() {
  
  let data: any
  (async () => {
    data = await getData()
    console.log(data)
  })()

  do {
    data = await getData()
    console.log(data)
  } while (data === undefined) 


  return (
    <main>
      <Graph data={data}/>
    </main>
  )
  
}
