import {
  createSelector
} from 'reselect'

const getVisibilityFilter = (state) => state.filter.filterState
const getFilterKeywords = (state) => state.filter.filterKeywords
const getTodos = (state) => state.todo.todos
const getUnsyncTodos = (state) => state.todo.pendingAddTodoList
const getTodosLength = (state) => getTodos(state).size
const getUnsyncTodosLength = (state) => getUnsyncTodos(state).size

export const getVisibleTodos = createSelector(
  [ getVisibilityFilter, getTodos ],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }
)

export const getVisibleTodosFilteredByKeyword = createSelector(
  [ getVisibleTodos, getFilterKeywords ],
  (visibleTodos, keyword) => visibleTodos.filter(
    todo => todo.name.includes(keyword)
  )
)

export const getVisibleUnsyncTodos = createSelector(
  [ getVisibilityFilter, getUnsyncTodos ],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }
)

export const getVisibleUnsyncTodosFilteredByKeyword = createSelector(
  [ getVisibleUnsyncTodos, getFilterKeywords ],
  (visibleTodos, keyword) => visibleTodos.filter(
    todo => todo.name.includes(keyword)
  )
)

export const isTodosEmpty = createSelector(
  [getTodosLength, getUnsyncTodosLength],
  (todosLength, unsyncTodosLength) => {
    if (todosLength + unsyncTodosLength === 0)
      return true
    else return false
  }
)