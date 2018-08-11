import reducer from './reducer'
import mockData from './mock_data'
import {
  Record,  List, OrderedSet
} from 'immutable';

import {
  todoState
} from './reducer'

const defaultTosoState = new todoState()

describe('add todo', () => {
  it('should handle ADD_TODO_OFFLINE', function () {
    const expectedState =
      defaultTosoState.set('pendingAddTodoList', new List([{...mockData.TodoReturn}]))

    expect(reducer(new todoState(), {
      type: 'ADD_TODO_OFFLINE',
      addedTodo: mockData.TodoReturn
    })).toEqual(expectedState)
  })

  it('should remove todo from pendingAddTodoList when handle ADD_TODO_OFFLINE_SUCCESS', function () {
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        pendingAddTodoList: new List([
          mockData.addTodo
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'ADD_TODO_OFFLINE_SUCCESS',
      error: mockData.error,
      key: mockData.key
    })).toEqual(defaultTosoState)
  })

})

describe('should handle UPDATE_SYNC_TODO (update sync todo in offline mode)', function () {
  it('should update todo in todos and add to pendingUpdateTodoList if empty', function () {
    const todoBeforeEdit = Object.assign({}, mockData.editTodo, {name: 'abc'})
    const modifiedDefaultTosoState = defaultTosoState.set('todos', new List([
      todoBeforeEdit
    ]))


    const todoAfterEdit = mockData.editTodo
    const expectedState =
      defaultTosoState.merge({
        todos: new List([
          todoAfterEdit
        ]),
        pendingUpdateTodoList: new List([
          todoAfterEdit
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'UPDATE_SYNC_TODO',
      newVal: mockData.editTodo
    })).toEqual(expectedState)
  })

  it('should update todo in todos and add to pendingUpdateTodoList if not empty', function () {
    const todoBeforeEdit = Object.assign({}, mockData.editTodo, {name: 'abc'})
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        todos: new List([
          todoBeforeEdit
        ]),
        pendingUpdateTodoList: new List([
          todoBeforeEdit
        ])
      })


    const todoAfterEdit = mockData.editTodo
    const expectedState =
      defaultTosoState.merge({
        todos: new List([
          todoAfterEdit
        ]),
        pendingUpdateTodoList: new List([
          todoAfterEdit
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'UPDATE_SYNC_TODO',
      newVal: mockData.editTodo
    })).toEqual(expectedState)
  })
})

describe('should handle UPDATE_UNSYNC_TODO (update unsync todo in offline mode)', function () {
  it('should update in pendingAddTodoList', function () {
    const todoBeforeEdit = Object.assign({}, mockData.editTodo, {name: 'abc'})
    const modifiedDefaultTosoState = defaultTosoState.set('pendingAddTodoList', new List([
      todoBeforeEdit
    ]))

    const todoAfterEdit = mockData.editTodo
    const expectedState =
      defaultTosoState.merge({
        pendingAddTodoList: new List([
          todoAfterEdit
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'UPDATE_UNSYNC_TODO',
      newVal: mockData.editTodo
    })).toEqual(expectedState)
  })
})

describe('update todo', function () {
  it('should update todo from pendingUpdateTodo when handle UPDATE_TODO_OFFLINE_FAILURE', function () {
    const todoAfterEdit = mockData.editTodo
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        pendingUpdateTodoList: new List([
          todoAfterEdit
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'UPDATE_TODO_OFFLINE_FAILURE',
      error: mockData.error,
      key: mockData.editTodo.key
    })).toEqual(defaultTosoState)
  })
})


describe('remove todo', function () {
  it('should remove todo from pendingTodoList when REMOVE_UNSYNC_TODO', function () {
    const todoBeforeDelete = Object.assign({}, mockData.editTodo, {name: 'abc'})
    const modifiedDefaultTosoState = defaultTosoState.set('pendingAddTodoList', new List([
      todoBeforeDelete
    ]))

    expect(reducer(modifiedDefaultTosoState, {
      type: 'REMOVE_UNSYNC_TODO',
      key: mockData.key
    })).toEqual(defaultTosoState)
  })

  it('should remove todo from todos and add key to pendingRemoveList when REMOVE_UNSYNC_TODO', function () {
    const todoBeforeDelete = Object.assign({}, mockData.editTodo, {name: 'abc'})
    const modifiedDefaultTosoState = defaultTosoState.set('todos', new List([
      todoBeforeDelete
    ]))

    const expectedState =
      defaultTosoState.merge({
        pendingAddTodoList: new List(),
        pendingRemoveTodoList: new OrderedSet([
          todoBeforeDelete.key
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'REMOVE_SYNC_TODO',
      key: mockData.key
    })).toEqual(expectedState)
  })

  it('should remove todo from todos and not add dupplicate to pendingRemoveList when REMOVE_UNSYNC_TODO', function () {
    const todoBeforeDelete = Object.assign({}, mockData.editTodo, {name: 'abc'})

    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        todos: new List([
          todoBeforeDelete
        ]),
        pendingRemoveTodoList: new OrderedSet([
          todoBeforeDelete.key
        ])
      })

    const expectedState =
      defaultTosoState.merge({
        todos: new List(),
        pendingRemoveTodoList: new OrderedSet([
          todoBeforeDelete.key
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'REMOVE_SYNC_TODO',
      key: mockData.key
    })).toEqual(expectedState)
  })

  it('should remove todo from pendingRemoveTodoList when handle UPDATE_TODO_OFFLINE_FAILURE', function () {
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        pendingRemoveTodoList: new OrderedSet([
          mockData.key
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'REMOVE_TODO_OFFLINE_FAILURE',
      error: mockData.error,
      key: mockData.key
    })).toEqual(defaultTosoState)
  })
})

describe('watch todo', function () {
  it('should add todo to todos when handle TODO_ADDED', function () {
    const expectedState =
      defaultTosoState.merge({
        todos: new List([mockData.addTodo]),
      })

    expect(reducer(defaultTosoState, {
      type: 'TODO_ADDED',
      addedTodo: mockData.addTodo
    })).toEqual(expectedState)
  })

  it('should edit todo from todos when handle TODO_ADDED', function () {
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        todos: new List([mockData.addTodo])
      })

    const expectedState =
      defaultTosoState.merge({
        todos: new List([mockData.editTodo]),
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'TODO_UPDATED',
      updatedTodo: mockData.editTodo
    })).toEqual(expectedState)
  })

  it('should add todo to todos when handle TODO_REMOVED', function () {
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        todos: new List([mockData.addTodo])
      })

    const expectedState =
      defaultTosoState.merge({
        todos: new List(),
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'TODO_REMOVED',
      key: mockData.key
    })).toEqual(expectedState)
  })

  it('should remove todo from pendingRemoveTodoList when handle UPDATE_TODO_OFFLINE_SUCCESS', function () {
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        pendingRemoveTodoList: new OrderedSet([
          mockData.key
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'REMOVE_TODO_OFFLINE_SUCCESS',
      key: mockData.key
    })).toEqual(defaultTosoState)
  })


  it('should remove todo from pendingUpdateTodo when handle UPDATE_TODO_OFFLINE_FAILURE', function () {
    const todoAfterEdit = mockData.editTodo
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        pendingUpdateTodoList: new List([
          todoAfterEdit
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'UPDATE_TODO_OFFLINE_SUCCESS',
      key: mockData.key
    })).toEqual(defaultTosoState)
  })

  it('should remove todo from pendingAddTodoList when handle ADD_TODO_OFFLINE_SUCCESS', function () {
    const modifiedDefaultTosoState =
      defaultTosoState.merge({
        pendingAddTodoList: new List([
          mockData.addTodo
        ])
      })

    expect(reducer(modifiedDefaultTosoState, {
      type: 'ADD_TODO_OFFLINE_SUCCESS',
      key: mockData.key
    })).toEqual(defaultTosoState)
  })
})






