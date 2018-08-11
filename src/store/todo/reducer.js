import {
  Record,  List, OrderedSet
} from 'immutable';


export let todoState = new Record({
  todos: new List(),
  pendingAddTodoList: new List(),
  pendingRemoveTodoList: new OrderedSet(),
  pendingUpdateTodoList: new List(),
  filterdTodos: new List(),
  isOnline: false,
}, 'todoRecord')

export default (previousState = new todoState(), action) => {
  switch (action.type) {
    case 'LOAD_TODO_SUCCESS':
      return previousState.set('todos', new List(action.todos))

    case 'SET_ONLINE':
    return previousState.set('isOnline', true)

    case 'SET_OFFLINE':
      return previousState.set('isOnline', false)

    // Same as above but add offline todo to queue
    case 'ADD_TODO_OFFLINE':
      return previousState.set('pendingAddTodoList', previousState.pendingAddTodoList.push(action.addedTodo))

    // Clear the queue if add successful or failure.
    case 'ADD_TODO_OFFLINE_FAILURE':
    case 'ADD_TODO_OFFLINE_SUCCESS':
      return previousState.set('pendingAddTodoList', previousState.pendingAddTodoList.filter(todo=>todo.key!==action.key))

    case 'CLEAR_ADD_TODO_LIST':
      return previousState.delete('pendingAddTodoList')


    case 'UNLOAD_TODO':
      return new todoState()

    case 'ADD_TODO':
      return previousState.set('todos', previousState.todos.unshift(action.todo))

    case 'REMOVE_SYNC_TODO':
      // add to pendingRemoveTodoList tooo
      return previousState.merge({
        todos: previousState.todos.filter(todo=>{
          return todo.key != action.key
        }),
        pendingRemoveTodoList: previousState.pendingRemoveTodoList.add(action.key)
      })
    case 'REMOVE_UNSYNC_TODO':
      return previousState.set('pendingAddTodoList', previousState.pendingAddTodoList.filter(todo=>{
        return todo.key != action.key
      }))

    case 'UPDATE_SYNC_TODO':
      // Find index to update
      let indexSync = previousState.todos.findIndex((todo)=>todo.key===action.newVal.key)

      // Check if pendingUpdateTodoList is exist (insert or update)
      let newPendingUpdateTodoList = null
      let newPendingUpdateTodoItemIndex = previousState.pendingUpdateTodoList.findIndex(todo=>todo.key===action.newVal.key)
      if (newPendingUpdateTodoItemIndex === -1) { // Not found
        newPendingUpdateTodoList = previousState.pendingUpdateTodoList.push(action.newVal)
      } else {
        newPendingUpdateTodoList = previousState.pendingUpdateTodoList.set(newPendingUpdateTodoItemIndex, action.newVal)
      }

      return previousState.merge({
        todos: previousState.todos.set(indexSync, action.newVal),
        pendingUpdateTodoList: newPendingUpdateTodoList
      })
    case 'UPDATE_UNSYNC_TODO':
      let indexUnsync = previousState.pendingAddTodoList.findIndex((todo)=>todo.key===action.newVal.key)
      return previousState.set('pendingAddTodoList', previousState.pendingAddTodoList.set(indexUnsync, action.newVal))

    case 'REMOVE_TODO_OFFLINE_SUCCESS':
    case 'REMOVE_TODO_OFFLINE_FAILURE':
      return previousState.set('pendingRemoveTodoList', previousState.pendingRemoveTodoList.filter(key=>key!=action.key))

    case 'UPDATE_TODO_OFFLINE_SUCCESS':
    case 'UPDATE_TODO_OFFLINE_FAILURE':
      return previousState.set('pendingUpdateTodoList', previousState.pendingUpdateTodoList.filter(todo=>todo.key!=action.key))

    // CHANGE FEED
    case 'TODO_ADDED':
      return previousState.set('todos', previousState.todos.push(action.addedTodo))
    case 'TODO_REMOVED':
      return previousState.set('todos', previousState.todos.filter((todo)=>todo.key!==action.key))
    case 'TODO_UPDATED':
      let index = previousState.todos.findIndex(todo=>todo.key===action.updatedTodo.key)
      return previousState.set('todos', previousState.todos.set(index, action.updatedTodo))

    default:
      return previousState;
  }
}