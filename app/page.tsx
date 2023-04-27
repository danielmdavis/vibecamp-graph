'use client'
import React, { useRef } from 'react'
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
        font: {
          family: 'Ultra',
          size: 9
        },
        maxRotation: 45,
        minRotation: 45,
        color: colors.black
      },
      grid: {
        color: colors.blue2
      },
    },
    x: {
      max: 100,
      ticks: {
        display: false
      },
      grid: {
        color: colors.blue2
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: colors.yellow,
        font: {
          family: 'Ultra'
        }, 
      }
    },
    beforeInit: (chart: any) => {
        chart.data.labels.forEach((e: any, i: any, a: any) => {
          if (/\n/.test(e)) {
              a[i] = e.split(/\n/);
          }
        });
    }
    
    // title: {
    //   display: true,
    //   text: 'Most Desired',
    //   position: 'bottom'
    // }
  }
}

// current, intial, history
// initial === history[0]. push current to history upon get

let dataset = require('./dataset1.json')
dataset = dataset.sort((a: any, b: any) => a.current - b.current)

const labels = dataset.map((item: any) => item.name)




export default function Home() {

  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       label: 'yesterday',
  //       data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].oldScore),
  //       backgroundColor: 'rgba(255, 99, 132, 0.5)'
  //     },
  //     {
  //       label: 'today',
  //       data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].score),
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)'
  //     }
  //   ]
  // }

  // const dataOld = {
  //   labels,
  //   datasets: [
  //     {
  //       label: 'yesterday',
  //       data: labels.map((nomen: string) => dataset.filter((item: any) => { return item.name === nomen})[0].oldScore),
  //       pointStyle: 'rectRounded',
  //       backgroundColor: 'rgb(239,103,69)', // orange
  //       borderWidth: 1.25,
  //       borderColor: 'rgb(75,182,203)' //blue2
  //     }
  //   ]
  // }

  const componentData = {
    labels,
    datasets: [
      {
        label: 'today',
        color: 'yellow',
        data: labels.map((nomen: string) => dataset.filter((item: any) => { return item.name === nomen})[0].current),
        pointStyle: 'rectRounded',
        backgroundColor: colors.pink,
        borderWidth: 1.25,
        borderColor: colors.blue2
      }
    ]
  }

  const historyArr = labels.map((nomen: string) => dataset.filter((item: any) => { return item.name === nomen})[0].history)
  const currentArr = labels.map((nomen: string) => dataset.filter((item: any) => { return item.name === nomen})[0].current)



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
  
  const animateAll = (currentArr: any, DOSArrs: any, chart: any) => {
    
    let delayOffset = 250
    for (let i = 0; i < DOSArrs[0].length; i += 1) {
      setTimeout(() => {
        const step = DOSArrs.map((n: any) => n = n[i])
        // console.log(currentArr, step)
        adjustDataOneStep(currentArr, step, chart)
        currentArr = currentArr.map((n: number, j: number) => n += step[j])
        if (i === DOSArrs[0].length - 1) {
          const colorArr = new Array(currentArr.length - 1).fill(colors.pink)
          chart.data.datasets[0].backgroundColor = colorArr
          chart.update()
        }
      }, delayOffset)
      delayOffset += 1000
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
