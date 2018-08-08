import {
  firebaseDb
} from '../../firebase'

import {
  addTodoOfflineSuccess,
  removeTodoOfflineSuccess,
  updateTodoOfflineSuccess,
} from '../todo/actions'


import {
  makeActionCreatorFunction
} from '../../helper/action_creator'

import {
  stateToUid,
  fireBaseSnapShootToTodoItem
} from '../../helper/transform'

let todoRef = null
let ignoreLastItemAlreadyPresentInDB = false

// Have to load all todo before watch so we could get todo count
export let watchTodo = (currentTodoCount) => (dispatch, getState) => {
  let uid = stateToUid(getState())
  todoRef = firebaseDb.ref(`users/${uid}`)

  if (currentTodoCount === 0) { // Dont need to ignore since there is no item to ignore
    ignoreLastItemAlreadyPresentInDB = true
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
 * But ignoreLastItemAlreadyPresentInDB is false -> first element in child added will be ignore so no check
 *
 *^ OR USE ORDERSET > IT'S ORDER AND NO DUPPLICATE
 */
export let childAdded = (addedTodo) => (dispatch, getState) => {
  if (!ignoreLastItemAlreadyPresentInDB) {
    ignoreLastItemAlreadyPresentInDB = true
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
    dispatch(addTodoOfflineSuccess(addedTodo))
  }
}

export let childRemoved = (deletedTodo) => (dispatch, getState) => {
   let {
    todo: {
      pendingRemoveTodoList
    }
  } = getState()


  let index = pendingRemoveTodoList.findIndex((deletedTodoOffline)=>{
    return deletedTodoOffline===deletedTodo.key
  })
  if (index !== -1) {
    dispatch(removeTodoOfflineSuccess(deletedTodo))
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
    dispatch(updateTodoOfflineSuccess(updatedTodo))
  }

  // Update UI. addTodoSuccess is logging function only. Same apply for update/remove
  dispatch(todoUpdated(updatedTodo))
}

let todoAdded = makeActionCreatorFunction('TODO_ADDED', 'addedTodo')
let todoRemoved = makeActionCreatorFunction('TODO_REMOVED', 'removedTodo')
let todoUpdated = makeActionCreatorFunction('TODO_UPDATED', 'updatedTodo')

export let unwatchTodo = () => () => {
  todoRef && todoRef.off()
}