
export async function getAllUserData(collection: any, getDocs: any, setState: any) {
    const usersCollection = collection
    const query = await getDocs(usersCollection)
    const usersList = query.docs.map((doc: any) => doc.data())
    setState(usersList)
  }

export async function setNewUserData(userData: any, setDoc: any, doc: any, db: any) {
    const fetchIt = 69
    userData.forEach((user: any) => {
        user.history = user.history.push(user.current)
        setDoc(doc(db, 'names'), {
        name: user.name,
        history: user.history,
        current: fetchIt
        })
    })
  }