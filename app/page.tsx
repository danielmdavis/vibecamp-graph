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


const options: any = {
  responsive: true,
  maintainAspectRatio: false,
  events: [], // hides tooltip
  indexAxis: 'y',
  scales: {
    y: {
      ticks: {
        font: {
          family: 'Ultra',
          size: 9
        },
        maxRotation: 45,
        minRotation: 45,
        color: 'rgb(46,36,37)' //black
      },
      grid: {
        color: 'rgb(75,182,203)' //blue2
      },
    },
    x: {
      ticks: {
        display: false
      },
      grid: {
        color: 'rgb(75,182,203)' //blue2
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'rgb(230,227,120)', //yellow
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

let dataset1 = require('./dataset1.json')
dataset1 = dataset1.sort((a: any, b: any) => a.score - b.score)

const labels = dataset1.map((item: any) => item.name)




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

  const dataOld = {
    labels,
    datasets: [
      {
        label: 'yesterday',
        data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].oldScore),
        pointStyle: 'rectRounded',
        backgroundColor: 'rgb(239,103,69)', // orange
        borderWidth: 1.25,
        borderColor: 'rgb(75,182,203)' //blue2
      }
    ]
  }

  const dataNew = {
    labels,
    datasets: [
      {
        label: 'today',
        color: 'yellow',
        data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].score),
        pointStyle: 'rectRounded',
        backgroundColor: 'rgb(233,102,170)', // pink
        borderWidth: 1.25,
        borderColor: 'rgb(75,182,203)' //blue2
      }
    ]
  }

  const dataOldArr = labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].oldScore)
  const dataNewArr = labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].score)

  const adjustData = (updateData: any, prevData: any, chart: any) => {
    
    for (let i = 0; i < chart.data.datasets[0].data.length; i += 1) {
      let diff = updateData[i] - prevData[i]
      chart.data.datasets[0].data[i] += diff
      console.log(diff, chart.data.datasets[0].data[i])
    }

  }
  
  let dataOption: any = dataNew
  
  const chartRef: any = useRef<ChartJS>(null)
  
  
  const onClick = (event: any) => {
    const chart: any = chartRef.current
    adjustData(dataOldArr, dataNewArr, chart)
    chart.data.datasets[0].backgroundColor = 'rgb(239,103,69)' // orange
    chart.clear()
    chart.update()
  }
  
  const onDeclick = (event: any) => {
    const chart: any = chartRef.current
    adjustData(dataNewArr, dataOldArr, chart)
    chart.data.datasets[0].backgroundColor = 'rgb(233,102,170)' // pink
    chart.clear()
    chart.update()
  }



  return (
    <main>
      <div style={{ height: '100vh', width: '100vw' }}>
        <Bar className='bar' ref={chartRef} options={options} data={dataOption} onMouseDown={onClick} onMouseUp={onDeclick} onTouchStart={onClick} onTouchEnd={onDeclick} />
      </div>
    </main>
  )
}
