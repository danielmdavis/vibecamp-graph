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

// firebase getter / setter
export async function getAllUserData(collection, getDocs, setState) {
  const usersCollection = collection
  const query = await getDocs(usersCollection)
  const usersList = query.docs.map((doc) => doc.data())
  setState(usersList)
}

export async function setNewUserData(userData, setDoc, doc, db) {
  const fetchIt = 69
  userData.forEach((user) => {
      user.history = user.history.push(user.current)
      setDoc(doc(db, 'names'), {
      name: user.name,
      history: user.history,
      current: fetchIt
      })
  })
}