import fetch from 'node-fetch'
import _ from 'lodash'

// csv api getter
export function getData() {
  const myHeaders = new Headers()
  myHeaders.append("Authorization", "Basic YWxpY2Vtb3R0b2xhQGdtYWlsLmNvbTpuZXJ2b3VzNm5lbGx5NA==")
  myHeaders.append("Cookie", "_gt_persistent_session=7f0a6c5e9b4e6646b428f7326d27dbef")
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    cache: 'no-store'
  }
  return fetch('https://www.guidedtrack.com/programs/22982/csv', requestOptions)
    .then(response => response.text())
    .then(result => { return result })
    .catch(error => console.log('error', error))
}

// firebase getter / setter
export async function getAllUserData(collection, getDocs, setState) {
  const usersCollection = collection
  const query = await getDocs(usersCollection)
  const usersList = query.docs.map(doc => doc.data())
  setState(usersList)
  return usersList
}


const postNewUsers = (newUsers, newDate, users, setDoc, doc, db) => {

  const oldNames = users.map(each => {
    return each.name
  })

  newUsers.forEach((value, nomen) => {
    if (!oldNames.includes(nomen) && oldNames.length !== 0) {
      setDoc(doc(db, 'users', nomen), {
        name: nomen,
        current: value,
        history: []
      })
    } 
    // unused. participants is static.
    // else if (oldNames.length !== 0) { // pushes new current to each extant entry to keep generations in sync
    //   stepScore(newUsers.get(nomen), newDate, users.filter(current => { 
    //     return current.name === nomen 
    //   }), setDoc, doc, db, first)
    // }
  })
}

const postNewScores = (newData, newDate, users, setDoc, doc, db) => {
  const first = newData.get(users[0].name)
  users.forEach(current => {
    stepScore(newData.get(current.name), newDate, current, setDoc, doc, db, first)
  })

}

const stepScore = (newCurrent, newDate, user, setDoc, doc, db, first) => {

  let history = user.history
  history?.push(user.current)
  // console.log(history, newCurrent, user.current)
  const toWrite = user.current >= newCurrent ? user.current : newCurrent
  if (toWrite > history[history.length - 1]) { // only adds higher scores - hacky but works
    console.log('inner bar')
    setDoc(doc(db, 'users', user.name), {
      name: user.name,
      current: toWrite,
      history: history
    })
    if (newCurrent === first) { // first makes it fire just once - hacky but works
      postNewDate(newDate, setDoc, doc, db)
    }
  }
}

export async function updateScores(newData, newDate, users, setDoc, doc, db) {

  let oldCurrent = users.map(each => {
    return each.current
  })
  oldCurrent.sort((a, b) => a - b)
  const newCurrent = Array.from(newData.values()).sort((a, b) => a - b)

  if (oldCurrent.length !== newCurrent.length) {
    postNewUsers(newData, newDate, users, setDoc, doc, db)
  } else if (!_.isEqual(oldCurrent, newCurrent) && !_.isEqual(oldCurrent, [])) {
    postNewScores(newData, newDate, users, setDoc, doc, db)
  }

}

export async function postNewDate(newDate, setDoc, doc, db) {
    const key = newDate + Math.floor(Math.random() * 10000)
    await setDoc(doc(db, 'dates', key), 
    {
      date: newDate
    })
  }