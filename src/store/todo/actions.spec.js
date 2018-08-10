import {
  addTodo,
  updateTodo,
  removeTodo
} from './actions'

import mockData from './mock_data'
import MockFirebase from './mock_firebase'

const onlineStore = mockStore({
  todo: {
    isOnline: true
  }, auth: {
    user: {
      id: 'test'
    }
  }
})

const offlineStore = mockStore({
  todo: {
    isOnline: false
  }, auth: {
    user: {
      id: 'test'
    }
  }
})

beforeEach(function () {
  onlineStore.clearActions()
  offlineStore.clearActions()
})

describe('Add todo', function () {
  // Online
  it('should dispatch toastr error when add todo online failure', function () {
    const mockFirebase = new MockFirebase(false)
    return onlineStore.dispatch(addTodo(mockData.name, mockFirebase)).then(() => {
      const actions = onlineStore.getActions()
      expect(actions[0]).toEqual(mockData.toasrAction)
      expect(actions[1]).toEqual({
        type: 'ADD_TODO_ONLINE_FAILURE',
        error: mockData.error
      })
    })
  })

  // Offline
  it('should dispatch addTodoOffline when add todo offline', function () {
    const mockFirebase = new MockFirebase(false)
    return offlineStore.dispatch(addTodo(mockData.name, mockFirebase)).then(() => {
      const actions = offlineStore.getActions()
      expect(actions[0]).toEqual({
        type: 'ADD_TODO_OFFLINE',
        addedTodo: mockData.TodoReturn
      })
    })
  })


  it('should dispatch toast error when add todo online failure', function () {
    const mockFirebase = new MockFirebase(false)
    return onlineStore.dispatch(addTodo(mockData.name, mockFirebase)).then(() => {
      const actions = onlineStore.getActions()
      expect(actions.length).toBe(2)
      expect(actions[0]).toEqual(mockData.toasrAction)
      expect(actions[1]).toEqual({
        type: 'ADD_TODO_ONLINE_FAILURE',
        error: mockData.error,
        key: undefined
      })
    })
  })


  it('should dispatch toast error andd ADD_TODO_OFFLINE_FAILURE when add todo offline failure', function () {
    const mockFirebase = new MockFirebase(false)
    return offlineStore.dispatch(addTodo(mockData.name, mockFirebase)).then(() => {
      const actions = offlineStore.getActions()
      expect(actions.length).toBe(3)
      expect(actions[1]).toEqual(mockData.toasrAction)
      expect(actions[2]).toEqual({
        type: 'ADD_TODO_OFFLINE_FAILURE',
        error: mockData.error,
        key: undefined
      })
    })
  })
})

describe('update todo', () => {
  it('should dispatch nothing when edit sync todo in online mode and success', function () {
    const mockFirebase = new MockFirebase(true)
    return onlineStore.dispatch(updateTodo(mockData.editTodo, true, mockFirebase)).then(() => {
      const actions = onlineStore.getActions()
      expect(actions).toHaveLength(0)
    })
  })

  it('should dispatch UPDATE_TODO_ONLINE_FAILURE and throw toastr error when edit sync todo in online mode and failure', function () {
    const mockFirebase = new MockFirebase(false)
    return onlineStore.dispatch(updateTodo(mockData.editTodo, false, mockFirebase)).then(() => {
      const actions = onlineStore.getActions()
      // One for toastr error and one for failure
      expect(actions).toHaveLength(2)
      expect(actions[0]).toEqual(mockData.toasrAction)
      expect(actions[1]).toEqual({
        type: 'UPDATE_TODO_ONLINE_FAILURE',
        error: mockData.error
      })
    })
  })

  it('should dispatch UPDATE_TODO_OFFLINE_FAILURE and throw toastr error when edit sync todo in online mode and failure', function () {
    const mockFirebase = new MockFirebase(false)
    return offlineStore.dispatch(updateTodo(mockData.editTodo, false, mockFirebase)).then(() => {
      const actions = offlineStore.getActions()
      // One for toastr error and one for failure
      expect(actions).toHaveLength(3)
      expect(actions[1]).toEqual(mockData.toasrAction)
      expect(actions[2]).toEqual({
        type: 'UPDATE_TODO_OFFLINE_FAILURE',
        error: mockData.error,
        key: mockData.editTodo.key
      })
    })
  })

  it('should dispatch UPDATE_SYNC_TODO when edit sync todo in offline mode', function () {
    const mockFirebase = new MockFirebase(false)
    return offlineStore.dispatch(updateTodo(mockData.editTodo, true, mockFirebase)).then(() => {
      const actions = offlineStore.getActions()
      expect(actions[0]).toEqual({
        type: 'UPDATE_SYNC_TODO',
        newVal: mockData.editTodo
      })
    })
  })

  it('should dispatch editSync when edit sync todo in offline mode', function () {
    const mockFirebase = new MockFirebase(false)
    return offlineStore.dispatch(updateTodo(mockData.editTodo, false, mockFirebase)).then(() => {
      const actions = offlineStore.getActions()
      expect(actions[0]).toEqual({
        type: 'UPDATE_UNSYNC_TODO',
        newVal: mockData.editTodo
      })
    })
  })
})

describe('remove todo', () => {
  it('should not dispatch removeSync when remove sync todo in online mode and success', function () {
    const mockFirebase = new MockFirebase(true)
    return onlineStore.dispatch(removeTodo(mockData.key, true, mockFirebase)).then(() => {
      const actions = onlineStore.getActions()
      expect(actions).toHaveLength(0)
    })
  })

  it('should dispatch removeSync and throw toastr error when remove sync todo in online mode and failure', function () {
    const mockFirebase = new MockFirebase(false)
    return onlineStore.dispatch(removeTodo(mockData.key, false, mockFirebase)).then(() => {
      const actions = onlineStore.getActions()
      // One for toastr error and one for failure
      expect(actions).toHaveLength(2)
      expect(actions[0]).toEqual(mockData.toasrAction)
      expect(actions[1]).toEqual({
        type: 'REMOVE_TODO_ONLINE_FAILURE',
        error: mockData.error
      })
    })
  })

  it('should dispatch removeSync when remove sync todo in offline mode', function () {
    const mockFirebase = new MockFirebase(false)
    return offlineStore.dispatch(removeTodo(mockData.key, true, mockFirebase)).then(() => {
      const actions = offlineStore.getActions()
      expect(actions[0]).toEqual({
        type: 'REMOVE_SYNC_TODO',
        key: mockData.key
      })
    })
  })

  it('should dispatch removeSync when remove sync todo in offline mode', function () {
    const mockFirebase = new MockFirebase(false)
    return offlineStore.dispatch(removeTodo(mockData.key, false, mockFirebase)).then(() => {
      const actions = offlineStore.getActions()
      expect(actions[0]).toEqual({
        type: 'REMOVE_UNSYNC_TODO',
        key: mockData.key
      })
    })
  })

  it('should dispatch REMOVE_TODO_OFFLINE_FAILURE and throw toastr error when edit sync todo in offline mode and failure', function () {
    const mockFirebase = new MockFirebase(false)
    return offlineStore.dispatch(removeTodo(mockData.key, false, mockFirebase)).then(() => {
      const actions = offlineStore.getActions()
      // One for toastr error and one for failure
      expect(actions).toHaveLength(3)
      expect(actions[1]).toEqual(mockData.toasrAction)
      expect(actions[2]).toEqual({
        type: 'REMOVE_TODO_OFFLINE_FAILURE',
        error: mockData.error,
        key: mockData.editTodo.key
      })
    })
  })
})