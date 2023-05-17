import Graph from './graphComponent'
import getData from './fetch.jsx'

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


// TO DO
// if scores aren't capped, refactor scale as percentage of leader
// implement pull from external api and write to db

export default function Home() {
  
  const data = getData()
  console.log(data)
  
  return (
    <main>
      <Graph />
    </main>
  )
}
