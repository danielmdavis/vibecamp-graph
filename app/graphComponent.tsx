'use client'
import React, { useState, useEffect, useRef } from 'react'
import { getAllUserData, updateScores } from './fetch'
import { 
  calcDataOffsetSequence, 
  calcMobileDataOffsetSequence, 
  calcAllDOS, 
  animateAll, 
  whichDOS, 
  historyStabilizer, 
  setDate, 
  setChartlessDate, 
  staticizePip 
} from './animation'
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

import Image from 'next/image'

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

  let [navigator, setNavigator]: any[] = useState('')
  let [users, setUsers]: any[] = useState([])
  let [dates, setDates]: any[] = useState([])
  let [running, setRunning]: any = useState(false)
  let [data, setData]: any[] = useState([])
  let [current, setCurrent]: any = useState({})
  let [xLimit, setXLimit]: any = useState(0)
  let [currDate, setCurrDate]: any = useState('June 5 2023')

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

    setNavigator(window.navigator)
    setData(props.data)
    const rankedChoice = parseRankedChoice()
    const parsedUsers =  parseUsers(rankedChoice)
    const currentScore = parseVotes(rankedChoice, parsedUsers)
    setCurrent(currentScore)
    const currentMap = new Map([...currentScore.entries()].sort((a: any, b: any) => b[1] - a[1]))

    updateScores(currentMap, getLatestDate(), users, setDoc, doc, db)
    
  },[props.data])

  const isMobile = () => {
    const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]
    if (navigator !== '') {
      return toMatch.some((toMatchItem) => {
          return navigator?.userAgent.match(toMatchItem);
      })
    }
  }

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

  const getVoteTurnout = (current: any[], voters: number) => {
    return Math.floor(getVoteTotal(current) / voters * 100)
  }


  // //
  //
  // all things chart
  //
  // //

//  const options: any = chartConfig

// mobile formatting
const fontSize = isMobile() ? 15 : 30
const padding = isMobile() ? 0.1 : 1.75

 let pipCounter = -1

 const options: any = { 
   responsive: true,
   maintainAspectRatio: false,
   events: '',
   indexAxis: 'y',
   animations: {
     tension: {
       duration: 5500,
       easing: 'easeOutBounce'
     }
   },
   layout: {
    padding: 20
  },
   scales: {
     y: 
         {
           id: 'names',
           stacked: true,
           position: {
             y: padding
           },
           ticks: {
            crossAlign: 'near',
            beginAtZero: true,
            font: {
              family: 'Tan Buster',
              size: fontSize
            },
            // maxRotation: 22.5,
            // minRotation: 22.5,
            color: 'rgb(188,239,246)',
            z: 2,
            mirror: true,
            padding: 50
           },
           grid: {
             display: false,
             color: 'rgba(75,182,203,0)'
           },
         },
     x: {
       stacked: true,
      //  position: {
      //    y: 20
      //  },
      max: xLimit,
      min: -5,
       ticks: {
         display: false,
         color: 'rgb(230,227,120)',
       },
       grid: {
         color: 'rgba(75,182,203,0)'
       }
     }
   },
   plugins: {
     legend: {
       display: false
     },
     title: {
       display: false,
       align: 'start',
       padding: {
        left: 150
       },
       text: 'Click for full timeline',
       color: 'rgb(242,215,170)',
       font: {
         family: 'Space Grotesk',
         size: fontSize
       }, 
       position: 'bottom'
     },
     datalabels: {
       formatter: (item: any) => {  // staticize pip score display as current
        if (pipCounter === currentArr.length - 1) {
          pipCounter = -1
        }
        if (item === -4) {
          pipCounter += 1
        }
        return staticArr[pipCounter]
       }
     }
   }
 }  

  // db get
  useEffect(() => {
    getAllUserData(collection(db, 'users'), getDocs, setUsers)
    getAllUserData(collection(db, 'dates'), getDocs, setDates)
  }, [])

  // parses for mapping
  const userData = users.sort((a: any, b: any) => a.current - b.current)
  const labels = userData.map((item: any) => item.name)
  const splitLabels = userData.map((item: any) => item.name.split(' '))
  const paddedLabels = userData.map((item: any) => `    ${item.name}`)

  const voters = 45
  const voteCount = props.data.data.length
  const voteTurnout = Math.floor(voteCount / voters * 100)

  const historyArr = historyStabilizer(labels, userData)
  const currentArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].current)
  const staticArr = JSON.parse(JSON.stringify(currentArr))
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
          color: 'rgba(0, 0, 0, 0)'
        },
        data: currentArr,
        pointStyle: 'rectRounded',
        backgroundColor: colors.blue1,
        backgroundShadowColor: colors.black,
        shadowBlur: 3,
        shadowOffsetX: 3,
        shadowOffsetY: 10,
        borderRadius: 200
      },
      {
        datalabels: {
          color: colors.blue2,
          font: {
            family: 'Tan Buster',
            size: fontSize
          }
        },
        data: pipArr,
        pointStyle: 'rectRounded',
        backgroundColor: colors.blue1,
        backgroundShadowColor: colors.black,
        shadowBlur: 3,
        shadowOffsetX: 3,
        shadowOffsetY: 10,
        borderRadius: 100,
        max: 4
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

  // sets static dimensions of chart in two different places
  const newX = Math.floor(Math.max(...currentArr) * multiplesOfLeader)
  if (chart !== null && newX !== -Infinity) {
    chart.config.options.scales.x.max = newX
    if (xLimit === 0) {
      setXLimit(newX)
    }
  }

  // console.log(setDate(chart))
  staticizePip(chart)

  const onClick = (event: any) => {
    const justDates = dates.map((date: any) => { return date.date })
    const chart: any = chartRef.current
    if (running === false) {
      animateAll(currentArr, whichDOS(isMobile, allMobileDOS, allDOS), chart, historyArr, setRunning, justDates, setCurrDate)
    }
    chart.clear()
    chart.update()
  }

  const isMobileHeader = isMobile() ? 'mobile-header': 'header'

  return (
    <main>
      <div className='grid-box'>
        <div className='head-box'>
        <div className='spacer'></div>
          <div className={isMobileHeader}>Dating Show to Save the World</div>
          <div className='sub-header'>Who will compete to win the heart of Vibecamps most elligible bachelorette?</div>
        </div>
        <Bar className='bar' ref={chartRef} options={options} data={dataOption} onMouseDown={onClick} onTouchStart={onClick} />
        <div className='foot-box'>
            <div className='footer-outer'>
              <div className='footer'>
                <img src='/3.png' className='icon' /> <span className='date'>{currDate}</span>
              </div>
            </div>
            <div className='footer-outer'>
              <div className='footer'>
                <img src='/2.png' className='ascender-icon' />  
                <span className='foot-1'>{voteCount}</span> <br /> 
                <span className='foot-2'>votes cast</span>
              </div>
            </div>        
            <div className='footer-outer'>
              <div className='footer'>
                <img src='/1.png' className='icon' />  
                <span className='foot-1'>{voteTurnout}% </span> <br />
                <span className='foot-2'>of vibecamp voted</span>
              </div>
            </div>
        </div>
      </div>
    </main>
  )
}
