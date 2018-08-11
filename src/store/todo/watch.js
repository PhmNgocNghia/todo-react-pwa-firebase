import {
  firebaseDb
} from '../../firebase'

import {
  addTodoOfflineSuccess,
  removeTodoOfflineSuccess,
  updateTodoOfflineSuccess,
} from './actions'


import {
  makeActionCreatorFunction
} from '../../helper/action_creator'

import {
  stateToUid,
  fireBaseSnapShootToTodoItem
} from '../../helper/transform'

let todoRef = null
let ignoreAddTodo = true

// Have to load all todo before watch so we could get todo count
export let watchTodo = (currentTodoCount) => (dispatch, getState) => {
  const state = getState()
  const {
    auth: {
      user: {
        uid
      }
    }
  } = state
  todoRef = firebaseDb.ref(`users/${uid}`)

  if (currentTodoCount === 0) { // Dont need to ignore since there is no item to ignore
    ignoreAddTodo = false
  }

  // Check should ignore or not. If have at least 1 element in db it will ignore the last itemW
  todoRef.endAt().limitToLast(1).on('child_added', (snapshoot) => {
    let todoItem = fireBaseSnapShootToTodoItem(snapshoot)
    dispatch(childAdded(todoItem))
  })

  todoRef.on('child_removed', (snapshoot) => {
    let todoItem = fireBaseSnapShootToTodoItem(snapshoot)
    dispatch(childRemoved(todoItem))
  })

  todoRef.on('child_changed', (snapshoot) => {
    let todoItem = fireBaseSnapShootToTodoItem(snapshoot)
    dispatch(childUpdated(todoItem))
  })
}

// Firebase child_added callback is call for all item inside firebase database
// If firebase have at leat 1 element it will be call for the last elemenent even it was added in the past
/**
 * Bug when
 * Todo inside Db is 0
 * Then add 1 todo offline mode
 * Go online. It's will add successfully
 * But we need childAdded event for detect if offline todo was completed successfully
 * But ignoreAddTodo is false -> first element in child added will be ignore so no check
 *
 *^ OR USE ORDERSET > IT'S ORDER AND NO DUPPLICATE
 */
export let childAdded = (addedTodo, IignoreAddTodo = ignoreAddTodo) => (dispatch, getState) => {
  if (ignoreAddTodo) {
    ignoreAddTodo = false
    return
  } else {
    // Update UI. addTodoSuccess is logging function only. Same apply for update/remove
    dispatch(todoAdded(addedTodo))
  }

   // Compare with queueAddedTodo List
   let {
    todo: {
      pendingAddTodoList
    }
  } = getState()


  let index = pendingAddTodoList.findIndex((addedTodoOffline)=>addedTodoOffline.key===addedTodo.key)
  if (index !== -1) {
    dispatch(addTodoOfflineSuccess(addedTodo.key))
  }
}

export let childRemoved = (deletedTodo) => (dispatch, getState) => {
   let {
    todo: {
      pendingRemoveTodoList
    }
  } = getState()


  if (pendingRemoveTodoList.includes(deletedTodo.key)) {
    dispatch(removeTodoOfflineSuccess(deletedTodo.key))
  }

  // Update UI. addTodoSuccess is logging function only. Same apply for update/remove
  dispatch(todoRemoved(deletedTodo.key))
}

export let childUpdated = (updatedTodo) => (dispatch, getState) => {
   let {
    todo: {
      pendingUpdateTodoList
    }
  } = getState()


  let index = pendingUpdateTodoList.findIndex((updatedTodoOffline)=>updatedTodoOffline.key===updatedTodo.key)
  if (index !== -1) {
    dispatch(updateTodoOfflineSuccess(updatedTodo.key))
  }

  // Update UI. addTodoSuccess is logging function only. Same apply for update/remove
  dispatch(todoUpdated(updatedTodo))
}

let todoAdded = makeActionCreatorFunction('TODO_ADDED', 'addedTodo')
let todoRemoved = makeActionCreatorFunction('TODO_REMOVED', 'key')
let todoUpdated = makeActionCreatorFunction('TODO_UPDATED', 'updatedTodo')

export let unwatchTodo = () => () => {
  todoRef && todoRef.off()
}