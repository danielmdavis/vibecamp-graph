import firebase from 'firebase/compat/app'
import { getFirestore } from 'firebase/firestore'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD7iFzuRFa_ZKqw3OYSe5U7Q7APmTffv7s",
  authDomain: "vibecamp-graph.firebaseapp.com",
  projectId: "vibecamp-graph",
  storageBucket: "vibecamp-graph.appspot.com",
  messagingSenderId: "747092492674",
  appId: "1:747092492674:web:85e78a3b46e68575858f9b",
  measurementId: "G-Q9JVJ1J9GM"
})

export const db = getFirestore(firebaseApp)
