'use client'
import React, { useState, useEffect, useRef } from 'react'
// import Curl from './curl'

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

// TO DO
// if scores aren't capped, refactor scale as percentage of leader
// unfuck mobile. why are the values themselves different?
// implement pull from external api and write to db

export default function Home() {
  
  let [users, setUsers]: any[] = useState([])
  let [raw, setRaw]: any = useState('')
  

  const getUpdates = async () => {

    const myHeaders = new Headers()
    // myHeaders.append('Authorization', 'Basic YWxpY2Vtb3R0b2xhQGdtYWlsLmNvbTpuZXJ2b3VzNm5lbGx5NA==')
    // myHeaders.append("Cookie", '_gt_persistent_session=6cddfb372bde63acc544298746360656')
    myHeaders.append('Authorization', 'Basic alicemottola@gmail.com:nervous6nelly4')

    const requestOptions = {
      method: 'GET',
      mode: 'no-cors' as RequestMode,
      redirect: 'follow' as RequestRedirect,
      headers: myHeaders
    }

    fetch('https://www.guidedtrack.com/programs/22568/csv', requestOptions)
      // .then(response => response.text())
      .then((response) => { return response })
      .then(response => console.log(response))
      .then(request => console.log(request))
      .then(result => console.log(result))
      .catch(error => console.log('error', error))

  }
  
  useEffect(() => {
    getUpdates()
  }, [])

  // const getUpdates = async () => {

  //   const curl = new Curl();
  //   const terminate = curl.close.bind(curl);

  //   curl.setOpt(Curl.option.URL, 'https://www.guidedtrack.com/programs/22568/csv')
  //   curl.setOpt(Curl.option.HTTPHEADER, ['Authorization: Basic alicemottola@gmail.com:nervous6nelly4'])
   
    
  //   curl.on("end", function (statusCode:any, data: any, headers: any) {
  //     console.info("Status code " + statusCode);
  //     console.info("***");
  //     console.info("Our response: " + data);
    
  //     this.close();
  //   });
  //   curl.on("error", terminate);
    
  //   curl.perform();

  // }



  const getAllUserData = async () => {
    const usersCollection = collection(db, 'users')
    const query = await getDocs(usersCollection)
    const usersList = query.docs.map((doc: any) => doc.data())
    setUsers(usersList)
  }
  
  const postNewUserScores =  () => { // pending implementation
    const fetchIt = 69
    users.forEach((user: any) => {
      user.history = user.history.push(user.current)
      setDoc(doc(db, 'names'), {
        name: user.name,
        history: user.history,
        current: fetchIt
      })
    })
    getAllUserData()
  }
  
  useEffect(() => {
    getAllUserData()
  }, [])
  
  const userData = users.sort((a: any, b: any) => a.current - b.current)
  const labels = userData.map((item: any) => item.name)
  const splitLabels = userData.map((item: any) => item.name.split(' '))

  const historyArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].history)
  const currentArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].current)

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

  const calcDataOffsetSequence = (current: number, history: any) => {

    let dataOffsetSequence: any = []
    dataOffsetSequence.push(history[0] - current)
    for (let i = 1; i < history.length; i += 1) {
      dataOffsetSequence.push(history[i] - history[i - 1])
    }
    dataOffsetSequence.push(current - history[history.length - 1])
    return dataOffsetSequence
  }

  const calcAllDOS = (current: any, history: any) => {

    let allDOS: any = []
    for (let i = 0; i < current.length; i += 1) {
      allDOS.push(calcDataOffsetSequence(current[i], history[i]))
    }
    return allDOS
  }
  const allDOS = calcAllDOS(currentArr, historyArr)

  const checkAndSetWinner = (chartData: any, chart: any, currentArr: any) => {

    let colorArr = new Array(currentArr.length - 1).fill(colors.orange)
    for (let i = 0; i < chartData.length; i += 1) {
      if (chartData[i] > chartData[currentArr.length - 1]) {
        colorArr[i] = colors.green
      } else {
        colorArr[i] = colors.orange
      }
    }
    chart.data.datasets[0].backgroundColor = colorArr
    chart.update()
  }

  const adjustDataOneStep = (currentArr: any, stepArr: any, chart: any) => {

    for (let i = 0; i < chart.data.datasets[0].data.length; i += 1) {
      chart.data.datasets[0].data[i] += stepArr[i]
      chart.update()
    }
    checkAndSetWinner(chart.data.datasets[0].data, chart, currentArr)
  }
  
  const calcAnimationSpeed = () => {
    
    const stepCount = historyArr[0].length + 1
    const timePerStep = 4500 / stepCount
    return timePerStep
  }

  const animateAll = (currentArr: any, DOSArrs: any, chart: any) => {
    
    let delayOffset = 250
    for (let i = 0; i < DOSArrs[0].length; i += 1) {
      setTimeout(() => {
        const step = DOSArrs.map((n: any) => n = n[i])
        adjustDataOneStep(currentArr, step, chart)
        currentArr = currentArr.map((n: number, j: number) => n += step[j])
        if (i === DOSArrs[0].length - 1) {
          const colorArr = new Array(currentArr.length - 1).fill(colors.pink)
          chart.data.datasets[0].backgroundColor = colorArr
          chart.update()
        }
      }, delayOffset)
      delayOffset += calcAnimationSpeed()
    }
  }
  
  let dataOption: any = componentData
  
  const chartRef: any = useRef<ChartJS>(null)
  
  
  const onClick = (event: any) => {
    const chart: any = chartRef.current
    animateAll(currentArr, allDOS, chart)
    chart.clear()
    chart.update()
  }
  


  return (
    <main>
      <div style={{ height: '100vh', width: '99vw' }}>
        <Bar className='bar' ref={chartRef} options={options} data={dataOption} onMouseDown={onClick} onTouchStart={onClick} />
      </div>
    </main>
  )
}
