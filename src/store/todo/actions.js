import {
  firebaseDb
} from '../../firebase';

import {
  makeAsyncAction,
  makeActionCreatorPropery,
  makeActionCreatorFunction
} from '../../helper/action_creator'

import loadingActions from '../loading/actions'

import {
  stateToUid
} from '../../helper/transform'

import {
  watchTodo
} from './watch'

let actionCreatedByCreator = {
  ...makeAsyncAction('loadTodo', {
    success: ['todos']
  }),
  ...makeAsyncAction('addTodoOnline', {
    success: 'addedTodo'
  }),
  ...makeAsyncAction('addTodoOffline', {
    success: 'addedTodo',
    error: 'addedTodo'
  }),
  ...makeAsyncAction('removeTodo', {
    success: 'removedTodo'
  }),
  ...makeAsyncAction('removeTodoOffline', {
    success: 'removedTodo'
  }),
  ...makeAsyncAction('updateTodo', {
    success: 'updatedTodo'
  }),
  ...makeAsyncAction('updateTodoOffline', {
    success: 'updatedTodo'
  }),
}

let {
  loadTodoFailure,
  loadTodoSuccess,
  addTodoOnlineFailure,
  addTodoOnlineSuccess,
  addTodoOfflineSuccess,
  addTodoOfflineFailure,
  removeTodoSuccess,
  removeTodoFailure,
  removeTodoOfflineSuccess,
  removeTodoOfflineFailure,
  updateTodoSuccess,
  updateTodoFailure,
  updateTodoOfflineSuccess,
  updateTodoOfflineFailure
} = actionCreatedByCreator

export {
  addTodoOfflineSuccess,
  removeTodoOfflineSuccess,
  removeTodoOfflineFailure,
  updateTodoOfflineSuccess,
  updateTodoOfflineFailure
}

let {
  showLoading,
  hideLoading
} = loadingActions

export let loadAnWatchTodo = (uid) => (dispatch) => {
  dispatch(showLoading())
  firebaseDb.ref(`users/${uid}`)
    .once('value')
    .then((snapshot) => {
      let snapShootValue = snapshot.val()

      // Transform snappShoot into array todo
      let todos = []
      for (let key in snapShootValue) {
        todos.push({
          key,
          name: snapShootValue[key].name,
          completed: snapShootValue[key].completed
        })
      }
      dispatch(loadTodoSuccess(todos))
      dispatch(hideLoading())
      dispatch(watchTodo(todos.length))
    })
    .catch((err)=>{
      dispatch(loadTodoFailure(err))
    })
}

export let unloadTodo = makeActionCreatorFunction('UNLOAD_TODO')
let addTodoOffline = makeActionCreatorFunction('ADD_TODO_OFFLINE', 'addedTodo')
export let addTodo = (name) => (dispatch, getState) => {
  // Check if is online or offline mode
  let {
    todo: {
      isOnline
    }, auth: {
      user: {
        uid
      }
    }
  } = getState()

  let addedTodo= {
    name,
    completed: false
  }

  if (isOnline) {
    firebaseDb.ref(`users/${uid}/`)
    .push(addedTodo)
    .then(({key})=>{
      addedTodo.key = key
      dispatch(addTodoOnlineSuccess(addedTodo))
    })
    .catch(err=>dispatch(addTodoOnlineFailure(err)))
  } else { // If offline
    // a key will needed to pendingAddTodoList: compare and remove
    let addTodoOfflineResult = firebaseDb.ref(`users/${uid}/`).push(addedTodo)
    addedTodo.key = addTodoOfflineResult.key

    // Add added todo to queue
    dispatch(addTodoOffline(addedTodo))

    // Wait for network to be commbit. Thanks for redux-offline. Queu
    addTodoOfflineResult
      .catch(err=>dispatch(addTodoOfflineFailure(err)))
      // .then(()=>dispatch(addTodoOfflineSuccess(addedTodo))) // Handle by child add event

  }
}

let removeSyncTodo = makeActionCreatorFunction('REMOVE_SYNC_TODO', 'key')
let removeUnsyncTodo = makeActionCreatorFunction('REMOVE_UNSYNC_TODO', 'key')
let updateSyncTodo = makeActionCreatorFunction('UPDATE_SYNC_TODO', 'newVal')
let updateUnsyncTodo = makeActionCreatorFunction('UPDATE_UNSYNC_TODO', 'newVal')

export default {
  unloadTodo,
  ...makeActionCreatorPropery('updateTodo', 'key', 'newVal'),
  ...makeActionCreatorPropery('removeTodo', 'key'),
  addTodo,
  removeTodo: (key, isSync) => (dispatch, getState) => {
    // Optismic UI update
    if (isSync) {
      dispatch(removeSyncTodo(key))
    } else {
      dispatch(removeUnsyncTodo(key))
    }

    // Remove from firebase for both sync and unsync
    // Sync: it's will be remove properly
    // Unsync: it's will be add and then remove thanks to firebase queue
    // Get uid => firebase ref => remove
    let uid = stateToUid(getState())
    firebaseDb.ref(`users/${uid}/${key}`).remove()
      .then((result)=>dispatch(removeTodoSuccess(result)))
      .catch(err=>dispatch(removeTodoFailure(err)))
  },
  updateTodo: (newVal, isSync) => (dispatch, getState) => {
      // Optismic UI update
      if (isSync) {
        dispatch(updateSyncTodo(newVal))
      } else {
        dispatch(updateUnsyncTodo(newVal))
      }

      // Remove from firebase for both sync and unsync
      // Sync: it's will be remove properly
      // Unsync: it's will be add and then remove thanks to firebase queue
      // Get uid => firebase ref => remove
      let uid = stateToUid(getState())

      firebaseDb.ref(`users/${uid}/${newVal.key}`).update(newVal)
        .then((result)=>dispatch(updateTodoSuccess(result)))
        .catch(err=>dispatch(updateTodoFailure(err)))
  },
  ...actionCreatedByCreator
}