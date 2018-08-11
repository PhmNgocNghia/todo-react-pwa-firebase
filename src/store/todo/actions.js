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
  ...makeAsyncAction('addTodoOnline'),
  ...makeAsyncAction('updateTodoOnline'),
  ...makeAsyncAction('removeTodoOnline'),
  ...makeAsyncAction('addTodoOffline', {
    success: ['key'],
    failure: ['key']
  }),
  ...makeAsyncAction('removeTodoOffline', {
    success: ['key'],
    failure: ['key']
  }),
  ...makeAsyncAction('updateTodoOffline', {
    success: ['key'],
    failure: ['key']
  }),
}

let {
  loadTodoFailure,
  loadTodoSuccess,

  addTodoOnlineFailure,
  addTodoOnlineSuccess,
  addTodoOfflineSuccess,
  addTodoOfflineFailure,

  removeTodoOfflineSuccess,
  removeTodoOfflineFailure,
  removeTodoOnlineFailure,


  updateTodoOnlineFailure,
  updateTodoOfflineFailure,
  updateTodoOfflineSuccess
} = actionCreatedByCreator

export {
  addTodoOfflineSuccess,
  removeTodoOfflineSuccess,
  removeTodoOfflineFailure,
  updateTodoOfflineFailure,
  updateTodoOfflineSuccess
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
export let addTodo = (name, IFirebase = firebaseDb) => (dispatch, getState) => {
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
    return IFirebase.ref(`users/${uid}/`)
      .push(addedTodo)
      .catch(err=>dispatch(addTodoOnlineFailure(err)))
  } else { // If offline
    // a key will needed to pendingAddTodoList: compare and remove
    let addTodoOfflineResult = IFirebase.ref(`users/${uid}/`).push(addedTodo)
    addedTodo.key = addTodoOfflineResult.key

    // Add added todo to queue
    dispatch(addTodoOffline(addedTodo))

    // Wait for network to be commbit. Thanks for redux-offline. Queu
    return addTodoOfflineResult
      .catch(err=>dispatch(addTodoOfflineFailure(err, addedTodo.key)))
      // .then(()=>dispatch(addTodoOfflineSuccess(addedTodo))) // Handle by child add event

  }
}

export let removeTodo = (key, isSync, IFirebase = firebaseDb) => (dispatch, getState) => {
    let {
      todo: {
        isOnline
      }, auth: {
        user: {
          uid
        }
      }
    } = getState()


    if (!isOnline) {
      // Optismic UI update
      if (isSync) {
        dispatch(removeSyncTodo(key))
      } else {
        dispatch(removeUnsyncTodo(key))
      }
    }

    return IFirebase.ref(`users/${uid}/${key}`).remove()
      .catch(err=>{
        if(isOnline) {
          dispatch(removeTodoOnlineFailure(err))
        } else {
          dispatch(removeTodoOfflineFailure(err, key))
        }
      })
}

export let updateTodo = (newVal, isSync, IFirebase = firebaseDb) => (dispatch, getState) => {
    let {
      todo: {
        isOnline
      }, auth: {
        user: {
          uid
        }
      }
    } = getState()


    if (!isOnline) {
      // Optismic UI update
      if (isSync) {
        dispatch(updateSyncTodo(newVal))
      } else {
        dispatch(updateUnsyncTodo(newVal))
      }
    }

    return IFirebase.ref(`users/${uid}/${newVal.key}`).update(newVal)
      .catch(err=>{
        if(isOnline) {
          dispatch(updateTodoOnlineFailure(err))
        } else {
          dispatch(updateTodoOfflineFailure(err, newVal.key))
        }
      })
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
  updateTodo,
  removeTodo,
  ...actionCreatedByCreator
}