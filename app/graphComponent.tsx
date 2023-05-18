'use client'
import React, { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'

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

  // getter / setter

  // api get
  useEffect(() => {
    setData(Papa.parse(props.data, {
      header: true
    }))
  },[props.data])
  console.log(data)

  // db get
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

  // animation builders
  const calcDataOffsetSequence = (current: number, history: any) => {
    let dataOffsetSequence: any = []
    dataOffsetSequence.push(history[0] - current)
    for (let i = 1; i < history.length; i += 1) {
      dataOffsetSequence.push(history[i] - history[i - 1])
    }
    dataOffsetSequence.push(current - history[history.length - 1])
    return dataOffsetSequence
  }

  const calcMobileDataOffsetSequence = (current: number, history: any) => {
    let dataOffsetSequence: any = []
    dataOffsetSequence.push(history[0] - current)
    for (let i = 1; i < history.length; i += 1) {
      dataOffsetSequence.push(history[i] - history[i - 1])
    }
    dataOffsetSequence.push(current - history[history.length - 1])
    dataOffsetSequence = dataOffsetSequence.map((offset: number) => { return offset / 2})
    return dataOffsetSequence
  }

  const calcAllDOS = (sequence: any, current: any, history: any) => {
    let allDOS: any = []
    for (let i = 0; i < current.length; i += 1) {
      allDOS.push(sequence(current[i], history[i]))
    }
    return allDOS
  }
  const allDOS = calcAllDOS(calcDataOffsetSequence, currentArr, historyArr)
  const allMobileDOS = calcAllDOS(calcMobileDataOffsetSequence, currentArr, historyArr)

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

  // animation runners
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

  const isRunning = (delayOffset: number, delayCount: number) => {
    setRunning(true)
    const disableDuration = delayOffset + calcAnimationSpeed() * (delayCount + 0.5)
    setTimeout(() => {
      setRunning(false)
    }, disableDuration)
  }

  const animateAll = (currentArr: any, DOSArrs: any, chart: any) => {
    let delayOffset = 250
    isRunning(delayOffset, DOSArrs[0].length)
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

  // checks mobility, halves offset to correct bug
  const isMobile = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor)
    return check;
  }

  const whichDOS = () => {
    if (isMobile()) {
      return allMobileDOS
    } else {
      return allDOS
    }
  }
  
  let dataOption: any = componentData
  const chartRef: any = useRef<ChartJS>(null)
  
  const onClick = (event: any) => {
    const chart: any = chartRef.current
    if (running === false) {
      animateAll(currentArr, whichDOS(), chart)
    }
    // console.log(users[1].history, users[1].current)
    // console.log(allDOS[1])
    // console.log(allMobileDOS[1])
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
