import firebase from 'firebase/app'

import {
  firebaseAuth,
  firebaseDb
} from '../../firebase'

import {
  makeAsyncAction,
  makeActionCreatorPropery,
  makeActionCreatorFunction
} from '../../helper/action_creator'

import loadingActions from '../loading/actions'

import {
  loadAnWatchTodo,
  unloadTodo,
  addTodo,
  removeTodoOfflineSuccess,
  removeTodoOfflineFailure,
  updateTodoOfflineSuccess,
  updateTodoOfflineFailure
} from '../todo/actions'


import {
  unwatchTodo
} from '../todo/watch'

const actionCreatedByCreator = {
  ...makeAsyncAction('auth', {
    success: ['user']
  }),

  ...makeAsyncAction('signOut'),
  ...makeAsyncAction('initApplication', {
    success: ['user']
  })
}

const {
  authSuccess,
  authFailure,
  initApplicationSuccess,
  initApplicationFailure,
  signOutSuccess,
  signOutFailure,
} = actionCreatedByCreator

let {
  hideLoading
} = loadingActions

const authenticate = (provider) => {
  return dispatch => {
    firebaseAuth.signInWithPopup(provider)
      .then(result => {
        const {
          user
        } = result
        dispatch(loadAnWatchTodo(user.uid))
        dispatch(authSuccess(user))
      })
      .catch(error => dispatch(authFailure(error)))
  }
}

const signOut = () => (dispatch) => {
  return firebaseAuth.signOut()
    .then(()=>{
      dispatch(signOutSuccess())
      dispatch(unloadTodo())
      dispatch(unwatchTodo())
    })
    .catch((err)=>dispatch(signOutFailure(err)))
}

let setOnline = makeActionCreatorFunction('SET_ONLINE')
let setOffline = makeActionCreatorFunction('SET_OFFLINE')
let clearpendingAddTodoList = makeActionCreatorFunction('CLEAR_ADD_TODO_LIST')

export default {
  authenticate,
  signOut,
  ...makeActionCreatorPropery('setOnline'),
  ...makeActionCreatorPropery('setOffline'),
  signInWithFacebook: () => authenticate(new firebase.auth.FacebookAuthProvider()),
  signInWithTwitter: () => authenticate(new firebase.auth.TwitterAuthProvider()),
  signInWithGithub: () => authenticate(new firebase.auth.GithubAuthProvider()),
  signInWithGoogle: () => authenticate(new firebase.auth.GoogleAuthProvider()),
  signInDummyAccount: () => (dispatch) => {
    firebase.auth().signInWithEmailAndPassword('test@gmail.com', '123456')
      .then(result => {
        const {
          user
        } = result
        dispatch(loadAnWatchTodo(user.uid))
        dispatch(authSuccess(user))
      })
      .catch(error => dispatch(authFailure(error)))
  },
  ...actionCreatedByCreator,
  initApplication: () => (dispatch, getState) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      authUser => {
        // load user auth data successfully
        unsubscribe()
        dispatch(initApplicationSuccess(authUser))

        if (authUser===null) {
          dispatch(hideLoading())
        }

        // If auth then therer was a chance last time add todo in offline mode
        if (authUser!=null) {
          // Loop add todo queue and push to firebase
          let {
            todo: {
              pendingAddTodoList,
              pendingRemoveTodoList,
              pendingUpdateTodoList
            }
          } = getState()

          // Since firebase push return new key. We have to clear queue and add it again incase we need to update it
          // Update the todo that haven't been sync
          let pendingAddTodoListToArray = pendingAddTodoList.toArray()

          // Just rerun firebase remove again no need to clear queue
          // Get the uid then get the ref

          // Pending update
          for (let todo of pendingUpdateTodoList) {
            firebaseDb.ref(`users/${authUser.uid}/${todo.key}`).update(todo)
              .then(todo=>dispatch(updateTodoOfflineSuccess(todo)))
              .catch(err=>dispatch(updateTodoOfflineFailure(err, todo)))
          }

          // Pending delete
          for (let key of pendingRemoveTodoList) {
            firebaseDb.ref(`users/${authUser.uid}/${key}`).remove()
              .then(key=>dispatch(removeTodoOfflineSuccess(key)))
              .catch(err=>dispatch(removeTodoOfflineFailure(err, key)))
          }

          // Clear queue
          dispatch(clearpendingAddTodoList())

          // Push them manually by dispatch an action. New key will be generate
          for (let todo of pendingAddTodoListToArray) {
            dispatch(addTodo(todo.name))
          }
        }

        // Watch for internet connection and add todo when online
        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function(snap) {
          const {
            auth: {
              user
            }
          } = getState()

          // If is auth and have internet then load
          let snapVal = snap.val()
          if (snapVal === true && user != null && user.uid != '') {
            dispatch(loadAnWatchTodo(user.uid))
          }

          // Set online & offline mode
          if (snapVal) {
            dispatch(setOnline())
          } else {
            dispatch(setOffline())
            dispatch(unwatchTodo())
          }
        });
      },
      error => initApplicationFailure(error)
    )
  }
}

