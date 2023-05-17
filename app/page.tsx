import { GetStaticProps } from 'next'

import Graph from './graphComponent'
import getData from './fetch.jsx'

// TO DO
// if scores aren't capped, refactor scale as percentage of leader
// implement pull from external api and write to db


export default async function Home() {
  
  // console.log(getData())
  let data
  (async () => {
    data = await getData()
    console.log(data)
  })()

  
  
  return (
    <main>
      <Graph data={data}/>
    </main>
  )
  
}
