import {
  childAdded,
  childUpdated,
  childRemoved
} from './watch'

import {
  OrderedSet, List
} from 'immutable'

import mockData from './mock_data'
import MockFirebase from './mock_firebase'



describe('childAdded', () => {
  it('should not dispatch addTodoOfflineSuccess and dispatch todo added when found todo in pendingAddTodoList', function () {
    const store = mockStore({
      todo: {
        pendingAddTodoList: new List()
      }
    })

    store.dispatch(childAdded(mockData.addTodo, false))
    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    expect(actions[0]).toEqual({
      type: 'TODO_ADDED',
      addedTodo: mockData.addTodo
    })
  })
  it('should dispatch addTodoOfflineSuccess and todo added when found todo in pendingAddTodoList', function () {
    const store = mockStore({
      todo: {
        pendingAddTodoList: [mockData.addTodo]
      }
    })

    store.dispatch(childAdded(mockData.addTodo, false))
    const actions = store.getActions()
    expect(actions).toHaveLength(2)
    expect(actions[0]).toEqual({
      type: 'TODO_ADDED',
      addedTodo: mockData.addTodo
    })
    expect(actions[1]).toEqual({
      type: 'ADD_TODO_OFFLINE_SUCCESS',
      key: mockData.key
    })
  })
})

describe('childUpdated', () => {
  it('should not dispatch updateTodoOfflineSuccess and dispatch todo updated when found todo in pendingUpdateTodoList', function () {
    const store = mockStore({
      todo: {
        pendingUpdateTodoList: new List()
      }
    })

    store.dispatch(childUpdated(mockData.editTodo))
    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    expect(actions[0]).toEqual({
      type: 'TODO_UPDATED',
      updatedTodo: mockData.editTodo
    })
  })
  it('should dispatch updateTodoOfflineSuccess and todo updated when found todo in pendingUpdateTodoList', function () {
    const store = mockStore({
      todo: {
        pendingUpdateTodoList: [mockData.editTodo]
      }
    })

    store.dispatch(childUpdated(mockData.editTodo))
    const actions = store.getActions()
    expect(actions).toHaveLength(2)
    expect(actions[0]).toEqual({
      type: 'UPDATE_TODO_OFFLINE_SUCCESS',
      key: mockData.key
    })
    expect(actions[1]).toEqual({
      type: 'TODO_UPDATED',
      updatedTodo: mockData.editTodo
    })
  })
})

describe('childRemoved', () => {
  it('should not dispatch removeTodoOfflineSuccess and dispatch todo removed when found todo in pendingRemoveTodoList', function () {
    const store = mockStore({
      todo: {
        pendingRemoveTodoList: new List()
      }
    })

    store.dispatch(childRemoved(mockData.addTodo))
    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    expect(actions[0]).toEqual({
      type: 'TODO_REMOVED',
      key: mockData.key
    })
  })
  it('should dispatch removeTodoOfflineSuccess and todo removed when found todo in pendingRemoveTodoList', function () {
    const store = mockStore({
      todo: {
        pendingRemoveTodoList: new OrderedSet([mockData.key])
      }
    })

    store.dispatch(childRemoved(mockData.addTodo))
    const actions = store.getActions()
    expect(actions).toHaveLength(2)
    expect(actions[0]).toEqual({
      type: 'REMOVE_TODO_OFFLINE_SUCCESS',
      key: mockData.key
    })
    expect(actions[1]).toEqual({
      type: 'TODO_REMOVED',
      key: mockData.key
    })
  })
})



