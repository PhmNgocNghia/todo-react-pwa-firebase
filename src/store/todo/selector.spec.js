import {
  getVisibleTodosFilterByState,
  getVisibleUnsyncTodosFilterByState,
  getVisibleTodosFilteredByKeyword,
  getVisibleUnsyncTodosFilteredByKeyword
} from './selector'

const state = {
  todo: {
    todos: [
      {name: 'foo', completed: true},
      {name: 'bar', completed: false},
      {name: 'baz', completed: true},
      {name: 'lorem', completed: false},
    ],

    pendingAddTodoList:  [
      {name: 'foo_unsync', completed: true},
      {name: 'bar_unsync', completed: false},
      {name: 'baz_unsync', completed: true},
      {name: 'lorem_unsync', completed: false},
    ]
  }
}

describe('getVisibleTodosFilterByState', function () {
  it('should get visible completed sync todos correctly', function () {
    let visibleTodos = getVisibleTodosFilterByState({...state, filter: {
      filterState: 'SHOW_COMPLETED'
    }})
    expect(visibleTodos).toHaveLength(2)
    expect(visibleTodos.some(todo=>todo.completed===false)).toBeFalsy()
  })

  it('should get visible active sync todos correctly', function () {
    let visibleTodos = getVisibleTodosFilterByState({...state, filter: {
      filterState: 'SHOW_ACTIVE'
    }})
    expect(visibleTodos).toHaveLength(2)
    expect(visibleTodos.some(todo=>todo.completed===true)).toBeFalsy()
  })

  it('should get visible sync todos correctly', function () {
    let visibleTodos = getVisibleTodosFilterByState({...state, filter: {
      filterState: 'SHOW_ALL'
    }})
    expect(visibleTodos).toHaveLength(4)
  })
})

describe('getVisibleUnsyncTodosFilterByState', () => {
  it('should get visible completed sync todos correctly', function () {
    let visibleTodos = getVisibleUnsyncTodosFilterByState({...state, filter: {
      filterState: 'SHOW_COMPLETED'
    }})
    expect(visibleTodos).toHaveLength(2)
    expect(visibleTodos.some(todo=>todo.completed===false)).toBeFalsy()
  })

  it('should get visible active sync todos correctly', function () {
    let visibleTodos = getVisibleUnsyncTodosFilterByState({...state, filter: {
      filterState: 'SHOW_ACTIVE'
    }})
    expect(visibleTodos).toHaveLength(2)
    expect(visibleTodos.some(todo=>todo.completed===true)).toBeFalsy()
  })

  it('should get visible sync todos correctly', function () {
    let visibleTodos = getVisibleUnsyncTodosFilterByState({...state, filter: {
      filterState: 'SHOW_ALL'
    }})
    expect(visibleTodos).toHaveLength(4)
  })
})

describe('getVisibleTodosFilteredByKeyword', function () {
  it('should filter compled todos by keywords correctly', function () {
    let visibleTodos = getVisibleTodosFilteredByKeyword({...state, filter: {
      filterState: 'SHOW_COMPLETED',
      filterKeywords: 'f'
    }})
    expect(visibleTodos).toHaveLength(1)
    expect(visibleTodos[0]).toEqual({
      name: 'foo',
      completed: true
    })
  })

  it('should filter active todos by keywords correctly', function () {
    let visibleTodos = getVisibleTodosFilteredByKeyword({...state, filter: {
      filterState: 'SHOW_ACTIVE',
      filterKeywords: 'b'
    }})
    expect(visibleTodos).toHaveLength(1)
    expect(visibleTodos[0]).toEqual({
      name: 'bar',
      completed: false
    })
  })

  it('should filter todos by keywords correctly', function () {
    let visibleTodos = getVisibleTodosFilteredByKeyword({...state, filter: {
      filterState: 'SHOW_ALL',
      filterKeywords: 'b'
    }})
    expect(visibleTodos).toHaveLength(2)
    expect(visibleTodos[0]).toEqual({
      name: 'bar',
      completed: false
    })
    expect(visibleTodos[1]).toEqual({
      name: 'baz',
      completed: true
    })
  })
})

describe('getVisibleUnsyncTodosFilteredByKeyword', function () {
  it('should filter compled todos by keywords correctly', function () {
    let visibleTodos = getVisibleUnsyncTodosFilteredByKeyword({...state, filter: {
      filterState: 'SHOW_COMPLETED',
      filterKeywords: 'f'
    }})
    expect(visibleTodos).toHaveLength(1)
    expect(visibleTodos[0]).toEqual({
      name: 'foo_unsync',
      completed: true
    })
  })

  it('should filter active todos by keywords correctly', function () {
    let visibleTodos = getVisibleUnsyncTodosFilteredByKeyword({...state, filter: {
      filterState: 'SHOW_ACTIVE',
      filterKeywords: 'b'
    }})
    expect(visibleTodos).toHaveLength(1)
    expect(visibleTodos[0]).toEqual({
      name: 'bar_unsync',
      completed: false
    })
  })

  it('should filter todos by keywords correctly', function () {
    let visibleTodos = getVisibleUnsyncTodosFilteredByKeyword({...state, filter: {
      filterState: 'SHOW_ALL',
      filterKeywords: 'b'
    }})
    expect(visibleTodos).toHaveLength(2)
    expect(visibleTodos[0]).toEqual({
      name: 'bar_unsync',
      completed: false
    })
    expect(visibleTodos[1]).toEqual({
      name: 'baz_unsync',
      completed: true
    })
  })
})