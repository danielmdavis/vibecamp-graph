'use client'
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'

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

  return (
    <main>
      <Bar options={options} data={data} />
    </main>
  )
}
