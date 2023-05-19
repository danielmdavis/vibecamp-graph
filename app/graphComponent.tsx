'use client'
import React, { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import { getAllUserData, setNewUserData } from './fetch'
import { calcDataOffsetSequence, calcMobileDataOffsetSequence, calcAllDOS, animateAll, isMobile, whichDOS } from './animation'

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore'

// **********
// ******
// **********

export default function Graph(props: { data: any }) {


  let [users, setUsers]: any[] = useState([])
  let [running, setRunning]: any = useState(false)
  let [data, setData]: any[] = useState([])

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
    blue1: 'rgb(16,84,164)',
    blue2: 'rgb(75,182,203)',
    black: 'rgb(46,36,37)',
    yellow: 'rgb(230,227,120)',
    pink: 'rgb(233,102,170)'
  }

  // static chart config
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    events: [], // hides tooltip
    indexAxis: 'y',
    animations: {
      tension: {
        duration: 5500,
        easing: 'easeOutBounce'
      }
    },
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          font: {
            family: 'Space Grotesk',
            size: 14
          },
          maxRotation: 22.5,
          minRotation: 22.5,
          color: colors.black
        },
        grid: {
          color: colors.blue2
        },
      },
      x: {
        max: 100,
        ticks: {
          // display: false,
          color: colors.yellow
        },
        grid: {
          color: colors.blue2
        }
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'bottom' as const,
        labels: {
          color: colors.yellow,
          font: {
            family: 'Space Grotesk'
          }, 
        }
      },
      title: {
        display: true,
        text: 'Click to see the full history of romantic acclaim',
        color: colors.black,
        font: {
          family: 'Space Grotesk',
          size: 18
        }, 
        position: 'bottom'
      }
    }
  }  

  // api get
  useEffect(() => {
    setData(Papa.parse(props.data, {
      header: true
    }))
  },[props.data])
  // console.log(data)

  // setNewUserData(users, setDoc, doc, db)
  
  useEffect(() => {
    getAllUserData(collection(db, 'users'), getDocs, setUsers)
  }, [])

  // parses for mapping
  const userData = users.sort((a: any, b: any) => a.current - b.current)
  const labels = userData.map((item: any) => item.name)
  const splitLabels = userData.map((item: any) => item.name.split(' '))

  const historyArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].history)
  const currentArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].current)

  // mapped chart config
  const componentData = {
    labels: splitLabels,
    datasets: [
      {
        // label: 'today',
        // color: 'yellow',
        data: currentArr,
        pointStyle: 'rectRounded',
        backgroundColor: colors.pink,
        backgroundShadowColor: colors.black,
        shadowBlur: 3,
        shadowOffsetX: 3,
        shadowOffsetY: 10,
        borderWidth: 1.25,
        borderColor: colors.blue2
      }
    ]
  }

  // animation sequences
  const allDOS = calcAllDOS(calcDataOffsetSequence, currentArr, historyArr)
  const allMobileDOS = calcAllDOS(calcMobileDataOffsetSequence, currentArr, historyArr)
  
  let dataOption: any = componentData
  const chartRef: any = useRef<ChartJS>(null)
  
  const onClick = (event: any) => {
    const chart: any = chartRef.current
    if (running === false) {
      animateAll(currentArr, whichDOS(isMobile, allMobileDOS, allDOS), chart, historyArr, setRunning)
    }
    chart.clear()
    chart.update()
  }
  
  return (
    <main>
      <div style={{ height: '100vh', width: '99vw' }}>
        <div className='header'>LoveBot 3000</div>
        <Bar className='bar' ref={chartRef} options={options} data={dataOption} onMouseDown={onClick} onTouchStart={onClick} />
      </div>
    </main>
  )
}
