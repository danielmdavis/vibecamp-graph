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

export const options = {
  responsive: true,
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


export const data = {
  labels,
  datasets: [
    {
      label: 'yesterday',
      data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].oldScore),
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: 'today',
      data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].score),
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
}

export default function Home() {

  const data1 = {
    labels,
    datasets: [
      {
        label: 'yesterday',
        data: labels.map((nomen: string) => dataset1.filter((item: any) => { return item.name === nomen})[0].oldScore),
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  const data2 = {
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

  const chartRef = useRef<ChartJS>(null)
  const onClick = (event: any) => {
    const chart: any = chartRef.current
    console.log(getElementsAtEvent(chart, event))

    if (dataOption === data1) {
      dataOption = data2
    } else {
      dataOption = data1
    }
    chart.data = dataOption
    chart.update('active')

  }

  return (
    <main>
      <Bar ref={chartRef} options={options} data={dataOption} onClick={onClick} />
    </main>
  )
}
