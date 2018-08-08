const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://todo-react-redux-2018.firebaseio.com/'
})

const database = admin.database()
const dummyUid = 'D6qRksIY7xNNgtB2UacZ2ymVBpg2'

module.exports =  {
  contains: (selector, text) => {
    var elements = document.querySelectorAll(selector)
    return [].filter.call(elements, function(element){
      return RegExp(text).test(element.textContent)
    })
  },

  clearDummyData: () => {
    return database.ref(`/users/${dummyUid}`).remove()
  },

  setTimeout: (ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  },

  findTodoByName: (name, callBack) => {
    return database
      .ref(`/users/${dummyUid}/`)
      .orderByChild('name')
      .equalTo(name)
      .once('value', callBack)
  },

  todoMustExistFirebase: (name, err) => {
    return new Promise((resolve, reject) => {
      database
      .ref(`/users/${dummyUid}/`)
      .orderByChild('name')
      .equalTo(name)
      .once('value', (snapshoot)=> {
        if(snapshoot.val())
          resolve()
        else
          reject(new Error(err))
      })
      .catch(err=>reject(err))
    })
  },

  todoMustNotExistFirebase: (name, err) => {
    return new Promise((resolve, reject) => {
      database
      .ref(`/users/${dummyUid}/`)
      .orderByChild('name')
      .equalTo(name)
      .once('value', (snapshoot)=> {
        if(snapshoot.val())
          reject(new Error(err))
        else
          resolve()
      })
      .catch(err=>reject(err))
    })
  },

  todoMustExistUI: (selector, err) => {
    if (selector.length === 0)
      throw new Error(err)
  },

  todoMustNotExistUI: (selector, err) => {
    if (selector.length !== 0)
      throw new Error(err)
  },

  getRef: () => {
    return database.ref(`/users/${dummyUid}/`)
  },

  addDummyTodo: (name) => {
    return database.ref(`/users/${dummyUid}/dummy`).set({
      name,
      completed: false
    })
  },

  getDummyTodoRef: () => {
    return database.ref(`/users/${dummyUid}/dummy`)
  }
}