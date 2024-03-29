'use client'
import _ from 'lodash'
import React, { useState, useEffect, useRef } from 'react'
import { keys } from './db'
import { getAllUserData, updateScores } from './fetch'
import { 
  calcDataOffsetSequence, 
  calcMobileDataOffsetSequence, 
  calcAllDOS, 
  animateAll, 
  whichDOS, 
  historyStabilizer, 
  staticizePip,
  setChartlessDate
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
import { Bar } from 'react-chartjs-2'
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
  let [currDate, setCurrDate]: any = useState('')
  let [voteCount, setVoteCount]: any = useState(0) // fix initial
  let [scoreTotal, setScoreTotal]: any = useState(0)
  // let [multiplesOfLeader, setMultiplesOfLeader]: any = useState()

  const firebaseApp = initializeApp(keys)
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

    const usersReturn: any = getAllUserData(collection(db, 'users'), getDocs, setUsers)
    usersReturn.then((response: any) => { // awaits user data
      setUsers(response)

      updateScores(currentMap, getLatestDate(), response, setDoc, doc, db)

      const userData = response.sort((a: any, b: any) => a.current - b.current)
      const labels = userData.map((item: any) => item.name)
      const currentArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].current)
      setCurrent(currentArr)
      setScoreTotal(currentArr.reduce((total: number, curr: number) => total + curr, 0))
    })


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
    let dates = props.data.data.map((date: any) => { return date['Time Started (UTC)']?.slice(0, 10) })

    const remove = dates.findIndex((date: any) => date?.run === '')
    dates.splice(remove, 1)
    return dates
  }
  const getLatestDate = () => {
    return parseDates()[parseDates().length - 1]
  }

  // const hardVoteTotal = props.data.data.length
  // console.log(props.data.data[props.data.data.length - 1])

  const adjustFooterOneStep = (currentVotes: any, currentArr: any, voters: any, historicalScore: any, hardVoteTotal: any, dateData?: any) => {
    const date = document.getElementById('date')
    const votes = document.getElementById('votes')
    const points = document.getElementById('points')
    const turnout = document.getElementById('turnout')
  
    let totalPoints = historicalScore.reduce((total: number, curr: number) => total + curr, 0)
    if (Number.isNaN(totalPoints)) { // get current total if historical unavailable
      totalPoints = currentArr.reduce((total: number, curr: number) => total + curr, 0)
    }
    if (date !== null) { 
      date.textContent = setChartlessDate(dateData)
    }

    // live adjust - toggle these if too divergent. this sacrifices displaying "which vote on timeline."
    // const votesToUse = currentVotes // rough iterating total
    const votesToUse = hardVoteTotal // absolute noniterating total
    // console.log(currentVotes, hardVoteTotal)

    if (votes !== null) { 
      // votes.textContent = votesToUse
      setVoteCount(votesToUse)
    }
 
    if ( turnout !== null && votesToUse / voters * 100 < 3) {
      turnout.textContent = `${(votesToUse / voters * 100).toFixed(1)}%`
    } else if (turnout !== null) {
      turnout.textContent = `${Math.round(votesToUse / voters * 100).toString()}%`
    }
  
    if ( points !== null) {
      if (isMobile()) {
        points.textContent = `\u00A0votes (${totalPoints})`
      } else {
        points.textContent = `votes cast (${totalPoints} pts)`
      }
    }
  }

//  const options: any = chartConfig

// db get
useEffect(() => {
  getAllUserData(collection(db, 'dates'), getDocs, setDates)
}, [])

// parses for mapping
const userData = users.sort((a: any, b: any) => a.current - b.current)
const labels = userData.map((item: any) => item.name)
const splitLabels = userData.map((item: any) => item.name.split(' '))
const paddedLabels = userData.map((item: any) => `    ${item.name}`)

const historyArr = historyStabilizer(labels, userData)
const currentArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].current)
const visiblePipArr = JSON.parse(JSON.stringify(currentArr)) // wip

// mobile formatting

const fontSize = isMobile() ? 15 : 20

// live adjust - from bigger to smaller as points accumulate
const padding = isMobile() ? 1.625 : 4.25 // smaller number moves labels left
let pipSize = 0
let pipArr = []
let pipPad = 0
if (currentArr.length > 0) {
  // live adjust - should track but keep an eye out
  pipSize = isMobile() ? currentArr[currentArr.length - 1] * -0.15 : currentArr[currentArr.length - 1] * -0.1
  pipPad = pipSize - 0.5
  pipArr = Array(currentArr.length).fill(pipSize)
}


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
    padding: 15
  },
   scales: {
     y: 
         {
           labelPlacement: 'inside',
           id: 'names',
           stacked: true,
           position: {
            y: padding
           },
           ticks: {
            beginAtZero: true,
            crossAlign: 'near',
            font: {
              family: 'Space Grotesk',
              size: fontSize
            },
            color: 'rgb(188,239,246)',
            z: 2,
            // mirror: true,
            padding: 50
           },
           grid: {
             display: false,
             color: 'rgba(75,182,203,0)'
           },
         },
     x: {
       stacked: true,
      max: xLimit,
      min: pipPad,
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
       }
     },
     datalabels: {
      formatter: (item: any) => {  // staticize pip score but display as current
        if (pipCounter === currentArr.length - 1) {
          pipCounter = -1
        }
        if (item === pipSize) {
          pipCounter += 1
        }
        return visiblePipArr[pipCounter]
      }
    }
  }
}  

  // footer parsing - direct append
  const voters = 770

  useEffect(() => {
    adjustFooterOneStep(historyArr[0]?.length + 1, currentArr, voters, currentArr, props.data.data.length)

    // sets static dimensions of chart
    const multiplesOfLeader = isMobile() ? 1 : 1.15
    const newX = Math.floor(Math.max(...currentArr) * multiplesOfLeader)
    if (chart !== null && newX !== -Infinity) {
      chart.config.options.scales.x.max = newX
      setXLimit(newX)
    }
  })
  
  // mapped chart config
  const componentData = {
    labels: paddedLabels,
    datasets: [
      {
        datalabels: {
          color: 'rgba(0, 0, 0, 0)'
        },
        data: currentArr,
        barPercentage: 1,
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
            family: 'Space Grotesk', // Tan Buster
            size: fontSize
          }
        },
        data: pipArr,
        barPercentage: 1,
        pointStyle: 'rectRounded',
        backgroundColor: colors.blue1,
        backgroundShadowColor: colors.black,
        shadowBlur: 3,
        shadowOffsetX: 3,
        shadowOffsetY: 10,
        borderRadius: 100,
        max: 4
      }
    ]
  }

  // animation sequences
  const allDOS = calcAllDOS(calcDataOffsetSequence, currentArr, historyArr)
  // const allMobileDOS = calcAllDOS(calcMobileDataOffsetSequence, currentArr, historyArr)
  const allMobileDOS = allDOS
  
  let dataOption: any = componentData
  const chartRef: any = useRef<ChartJS>(null)
  
  const chart: any = chartRef.current

  staticizePip(chart, pipSize)

  const onClick = (event: any) => {
    const justDates = dates.map((date: any) => { return date.date })
    const chart: any = chartRef.current
    if (running === false) {
      animateAll(currentArr, whichDOS(isMobile, allMobileDOS, allDOS), chart, historyArr, setRunning, adjustFooterOneStep, justDates, voters, visiblePipArr)
    }
  }

  const isMobileBody = isMobile() ? 'mobile-grid-box' : 'grid-box'
  const isMobileHeader = isMobile() ? 'mobile-header': 'header'
  const isMobileSubHeader = isMobile() ? 'mobile-sub-header': 'sub-header'
  const isMobileSpacer = isMobile() ? 'mobile-spacer' : 'spacer'
  const isMobileBar = isMobile() ? 'mobile-bar' : 'bar'
  const isMobileBarClick = isMobile() ? undefined : onClick
  const isMobileSubFooter = isMobile() ?
  <div className='mobile-sub-footer' onMouseDown={onClick} style={{ textAlign: 'center' }}>View Timeline</div>
  :
  <div className='sub-footer' style={{ textAlign: 'center' }}>Click to view a timeline of romantic history</div>
  const isMobileFooter = isMobile() 
  ? 
  <div className='mobile-foot-box'>
    <span className='mobile-footer'>
      <img src='/3.png' className='icon' /> <span id='date'>{currDate}</span>
    </span>
    <span className='mobile-footer'>
      <img src='/2.png' className='icon' /> <span id='votes'>{voteCount} votes <br /> </span><span id='points'>({scoreTotal})</span>
    </span>
    <span className='mobile-footer'>
      <img src='/1.png' className='icon' /> <span id='turnout'>0% <br /> voted </span>
    </span>
  </div>
  :
  <div className='foot-box'>
    <div className='footer-outer'>
      <div className='footer'>
        <img src='/3.png' className='icon' /> <span id='date' className='date'>{currDate}</span>
      </div>
    </div>
    <div className='footer-outer'>
      <div className='footer'>
        <img src='/2.png' className='ascender-icon' />  
        <span id='votes' className='foot-1'>{voteCount}</span> <br /> 
        <span id='points' className='foot-2'>votes cast ({scoreTotal} pts)</span>
      </div>
    </div>        
    <div className='footer-outer'>
      <div className='footer'>
        <img src='/1.png' className='icon' />  
        <span className='foot-1' id='turnout'>0% </span> <br />
        <span className='foot-2'>of vibecamp voted</span>
      </div>
    </div>
  </div>

  return (
    <main>
      <div className={isMobileBody}>
        <div className='head-box'>
        <div className={isMobileSpacer}></div>
          <div className={isMobileHeader}>Dating Show to Save the World</div>
          <div className={isMobileSubHeader}>Vote to send three campers to the dating show, where they’ll compete for the heart of vibecamp’s hottest bachelorette
        </div>
        </div>
        <Bar className={isMobileBar} ref={chartRef} options={options} data={dataOption} onMouseDown={isMobileBarClick} onTouchStart={isMobileBarClick} />
        {isMobileFooter}
        {isMobileSubFooter}
      </div>
    </main>
  )
}
