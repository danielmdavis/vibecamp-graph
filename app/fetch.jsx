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

export function checkDataForChange(getData, stateData) {
  
}

// firebase getter / setter
export async function getAllUserData(collection, getDocs, setState) {
  const usersCollection = collection
  const query = await getDocs(usersCollection)
  const usersList = query.docs.map(doc => doc.data())
  setState(usersList)
}

const postNewUsers = (newUsers, users, setDoc, doc, db) => {

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
    } else if (oldNames.length !== 0) { // pushes a new current to each extant entry to keep generations in sync
      stepScore(newUsers.get(nomen), users.filter(current => { 
        return current.name === nomen 
      }), setDoc, doc, db)
    }
  })
}

const postNewScores = (newData, users, setDoc, doc, db) => {
  users.forEach(current => {
    stepScore(newData.get(current.name), current, setDoc, doc, db)
  })

}

const stepScore = (newCurrent, user, setDoc, doc, db) => {

  let history = user.history
  history.push(user.current)
  setDoc(doc(db, 'users', user.name), {
    name: user.name,
    current: newCurrent,
    history: history
  })
}

export async function updateScores(newData, newDate, users, setDoc, doc, db) {

  const oldCurrent = users.map(each => {
    return each.current
  })
  const newCurrent = Array.from(newData.values()).sort()
  
  if (oldCurrent.length !== newCurrent.length) {
    postNewUsers(newData, users, setDoc, doc, db)
  } else if (!_.isEqual(oldCurrent, newCurrent)) {
    postNewScores(newData, users, setDoc, doc, db)
  }

  postNewDate(newDate, setDoc, doc, db)
}

export async function postNewDate(newDate, setDoc, doc, db) {

  setDoc(doc(db, 'dates', newDate)), {
    date: newDate
  }
}