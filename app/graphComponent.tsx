'use client'
import React, { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import { getAllUserData, updateScores } from './fetch'
import { calcDataOffsetSequence, calcMobileDataOffsetSequence, calcAllDOS, animateAll, isMobile, whichDOS, historyStabilizer, setDate } from './animation'
import { chartConfig } from './chartConfig'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, getElementsAtEvent } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore'

// **********
// ******
// **********

export default function Graph(props: { data: any }) {


  let [users, setUsers]: any[] = useState([])
  let [dates, setDates]: any[] = useState([])
  let [running, setRunning]: any = useState(false)
  let [data, setData]: any[] = useState([])
  let [current, setCurrent]: any = useState({})

  const firebaseApp = initializeApp({
    apiKey: "AIzaSyD7iFzuRFa_ZKqw3OYSe5U7Q7APmTffv7s",
    authDomain: "vibecamp-graph.firebaseapp.com",
    projectId: "vibecamp-graph",
    storageBucket: "vibecamp-graph.appspot.com",
    messagingSenderId: "747092492674",
    appId: "1:747092492674:web:85e78a3b46e68575858f9b",
    measurementId: "G-Q9JVJ1J9GM"
  })
  const db = getFirestore(firebaseApp)

  const colors = {
    orange: 'rgb(239,103,69)',
    green: 'rgb(53,124,94)',
    blue1: 'rgb(66,174,239)',
    blue2: 'rgb(188,239,246)',
    black: 'rgb(46,36,37)',
    yellow: 'rgb(250,210,85)',
    pink: 'rgb(233,102,170)',
    purple: 'rgb(86,27,90)'
  }

  // api get, parse user list, selections, scores, push new to db
  useEffect(() => {

    setData(props.data)
    const rankedChoice = parseRankedChoice()
    const parsedUsers =  parseUsers(rankedChoice)
    const currentScore = parseVotes(rankedChoice, parsedUsers)
    setCurrent(currentScore)
    const currentMap = new Map([...currentScore.entries()].sort((a: any, b: any) => b[1] - a[1]))

    updateScores(currentMap, getLatestDate(), users, setDoc, doc, db)

  },[props.data])
  

  // parsing for incoming api data
  const parseRankedChoice = () => {

    const rankedRaw = props.data.data?.map((each: any) => { return each.out_itemsInSelectedOrder })
    const rankedClean = rankedRaw?.map((each: string) => { return each?.substring(1, each.length - 1) })
    return rankedClean?.map((each: string) => { return each?.replace(/"/g, '').split(',') })
  }

  const parseUsers = (rankedChoice: any) => {

    let uniqueUsers = new Set()
    rankedChoice?.forEach((each: string[]) => {each?.forEach((each: string) => { uniqueUsers.add(each) })})
    uniqueUsers.delete('')
    return uniqueUsers
  }

  const parseVotes = (lists: string[], users: any) => {

    let currentScore: any = Object.fromEntries(Array?.from(users)?.map((nomen: string) => [nomen, 0]))
    lists?.forEach((curr: any) => { 
      for (let i = 0; i < curr?.length;) {
        const value = curr.length
        const current = curr.shift()
        currentScore[current] += value
      }
    })
    delete currentScore['']
    return new Map(Object.entries(currentScore))
  }

  const parseDates = () => {
    return props.data.data.map((each: any) => { return each['Time Finished (UTC)']?.slice(0, 10) })
  }

  const getLatestDate = () => {
    return parseDates()[parseDates.length - 1]
  }


  // //
  //
  // all things chart
  //
  // //

  const options: any = chartConfig

  // db get
  useEffect(() => {
    getAllUserData(collection(db, 'users'), getDocs, setUsers)
    getAllUserData(collection(db, 'dates'), getDocs, setDates)
  }, [])

  // parses for mapping
  const userData = users.sort((a: any, b: any) => a.current - b.current)
  const labels = userData.map((item: any) => item.name)
  console.log(labels)
  const splitLabels = userData.map((item: any) => item.name.split(' '))
  const paddedLabels = userData.map((item: any) => `    ${item.name}`)

  const historyArr = historyStabilizer(labels, userData)
  const currentArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].current)
  let pipArr = []
  if (currentArr.length > 0) {
    pipArr = Array(currentArr.length).fill(-4)
  }
  
  // mapped chart config
  const componentData = {
    labels: paddedLabels,
    datasets: [
      {
        datalabels: {
          color: colors.blue1
        },
        data: currentArr,
        pointStyle: 'rectRounded',
        backgroundColor: colors.blue1,
        backgroundShadowColor: colors.black,
        shadowBlur: 3,
        shadowOffsetX: 3,
        shadowOffsetY: 10,
        borderRadius: 100
      },
      {
        datalabels: {
          color: colors.blue2,
          font: {
            family: 'Tan Buster',
            size: 30
          }
        },
        data: pipArr,
        pointStyle: 'rectRounded',
        backgroundColor: colors.blue1,
        backgroundShadowColor: colors.black,
        shadowBlur: 3,
        shadowOffsetX: 3,
        shadowOffsetY: 10,
        borderRadius: 100
        // borderWidth: 3,
        // borderColor: colors.blue2
      }
    ]
  }



  // animation sequences
  const allDOS = calcAllDOS(calcDataOffsetSequence, currentArr, historyArr)
  // const allMobileDOS = calcAllDOS(calcMobileDataOffsetSequence, currentArr, historyArr)
  const allMobileDOS = allDOS // the bug self-resolved, making workaround superfluous. keeping paralell structure in place.
  
  let dataOption: any = componentData
  const chartRef: any = useRef<ChartJS>(null)
  
  // sets 
  const multiplesOfLeader = 1.2
  const chart: any = chartRef.current
  const newX = Math.floor(Math.max(...currentArr) * multiplesOfLeader)
  if (chart !== null && newX !== -Infinity) {
    chart.config.options.scales.x.max = newX
  }
  setDate(chart)

  const onClick = (event: any) => {
    const chart: any = chartRef.current
    const justDates = dates.map((date: any) => { return date.date })
    if (running === false) {
      animateAll(currentArr, whichDOS(isMobile, allMobileDOS, allDOS), chart, historyArr, setRunning, justDates)
    }
    chart.clear()
    chart.update()
  }
  
  return (
    <main>
      <div className='grid-box'>
        <div className='header'>Dating Show to Save the World</div>
        <Bar className='bar' ref={chartRef} options={options} data={dataOption} onMouseDown={onClick} onTouchStart={onClick} />
      </div>
    </main>
  )
}
