
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO
// if scores aren't capped, refactor scale as percentage of leader ?
// make first step non-eased
// fix bug with leader coloration
// fix new bug with mobile animu
// componentize data parsing

export default async function Home() {
  

  let data: any
  do {
    data = await getData()
    data = Papa.parse(data, {
      header: true
    })

    // if (data) {
    //   const rankedChoice = parseRankedChoice()
    //   const parsedUsers = parseUsers(rankedChoice)
    //   console.log(parsedUsers)
    //   parseVotes(rankedChoice, parsedUsers)
  
    // }
  } while (data === undefined) 


  return (
    <main>
      <Graph data={data}/>
    </main>
  )
  
}
