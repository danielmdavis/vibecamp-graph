'use client'
import React, { useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Most Desired',
      position: 'bottom'
    }
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

  const data2 = {
    labels,
    datasets: [
      {
        label: 'yesterday',
        data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].oldScore),
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  const data1 = {
    labels,
    datasets: [
      {
        label: 'today',
        data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].score),
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  }

  let dataOption = data1

  const chartRef: any = useRef<ChartJS>(null)


  const onClick = (event: any) => {
    const chart: any = chartRef.current
    // console.log(getElementsAtEvent(chart, event))

    // if (dataOption === data1) {
    //   dataOption = data2
    // } else {
    //   dataOption = data1
    // }
    dataOption = data2
    chart.data = dataOption
    chart.update('resize')
  }

  const onMouseUp = (event: any) => {
    const chart: any = chartRef.current
    dataOption = data1
    chart.data = dataOption
    chart.update('resize')

  }

  return (
    <main>
      <div style={{ height: '100vh', width: '100vw' }}>
        <Bar className='bar' ref={chartRef} options={options} data={dataOption} onMouseDown={onClick} onMouseUp={onMouseUp} onTouchStart={onClick} onTouchEnd={onMouseUp} />
      </div>
    </main>
  )
}
