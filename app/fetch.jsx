import fetch from 'node-fetch'

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
  return fetch("https://www.guidedtrack.com/programs/22568/csv", requestOptions)
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

export async function postNewUsers(newUsers, users, setDoc, doc, db) {

  const oldNames = users.map(each => {
    return each.name
  })
  newUsers.forEach((value, nomen) => {
    if (!oldNames.includes(nomen) && oldNames.length !== 0) {
      console.log(nomen)
      setDoc(doc(db, 'users', nomen), {
        name: nomen,
        current: value,
        history: []
      })
    }
  })
}

export async function updateScores(newData, users, setDoc, doc, db) {

  const oldCurrent = users.map(each => {
    return each.current
  })
  const newCurrent = Array.from(newData.values()).sort()
  // console.log(oldCurrent)
  // console.log(newCurrent)
}