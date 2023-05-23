
import Graph from './graphComponent'
import Papa from 'papaparse'
import { getData } from './fetch.jsx'

// TO DO
// if scores aren't capped, refactor scale as percentage of leader
// make csv data relevant
// check csv data for change, if change, write to db

export default async function Home() {
  
  const parseRankedChoice = () => {

    const rankedRaw = data.data?.map((each: any) => { return each.out_itemsInSelectedOrder })
    const rankedClean = rankedRaw?.map((each: string) => { return each?.substring(1, each.length - 1) })
    const splitRankedClean = rankedClean?.map((each: string) => { return each?.replace(/"/g, '').split(',') })
    return splitRankedClean
  }

  const parseUsers = (rankedChoice: any) => {

    let uniqueUsers = new Set()
    rankedChoice?.forEach((each: string[]) => {each?.forEach((each: string) => { uniqueUsers.add(each) })})
    uniqueUsers.delete('')
    return uniqueUsers
  }

  const parseVotes = (lists: string[], users: any) => {

    let currentScore = Object.fromEntries(Array?.from(users)?.map((nomen: string) => [nomen, 0]))

    lists?.forEach((curr: any) => { 
      for (let i = 0; i < curr?.length;) {
        const value = curr?.length
        const current = curr.shift()
        currentScore[current] += value
      }
    })

    console.log(currentScore)

  }


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
