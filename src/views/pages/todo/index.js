import React from 'react'
import {
  connect
} from 'react-redux'
import {
  CSSTransition
} from 'react-transition-group'
import styled from 'styled-components'
import Button from '../../components/button.js'
import TodoForm from '../../components/todo_form'
import TodoSearch from '../../components/todo_search'
import TodoList from '../../components/todo_list.js'
import TodoFilterList from '../../components/todo_filter_list.js'
import Display from '../../components/display'
import Card from '../../components/transparentCard'
import filterActions from '../../../store/filter/actions'
import todoActions from '../../../store/todo/actions'
import authActions from '../../../store/auth/actions'
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome'
import {
  getVisibleTodosFilteredByKeyword,
  getVisibleUnsyncTodosFilteredByKeyword,
  isTodosEmpty
} from '../../../store/todo/selector'
import propTypes from 'prop-types'
import { List } from 'immutable';

const EmptyTextWrapper = styled.div`
  font-weight: bold;
  text-align: center;
`

class Todo extends React.PureComponent {
  constructor(props) {
    super (props)
    this.state = {

    }
  }

  removeSyncTodo = (todo) => {
    this.props.removeTodo(todo.key, true)
  }

  removeUnsyncTodo = (todo) => {
    this.props.removeTodo(todo.key, false)
  }

  updateSyncTodo = (newVal) => {
    this.props.updateTodo(newVal, true)
  }

  updateUnsyncTodo = (newVal) => {
    this.props.updateTodo(newVal, false)
  }

  render () {
    const {
      addTodo,
      todos,
      displayName,
      signOut,
      updateFilterState,
      updateFilterKeywords,
      filterState,
      pendingAddTodoList,
      isTodosEmpty,
      filterKeywords
     } = this.props

    return pug`
  div.d-flex.justify-content-center.align-items-center.container
    Card.p-4.w-100vw
      div.d-flex.mb-2
        div.ml-auto.pr-2
          | Hi,
          | #{displayName}
          |
        span |
        Button(
          onClick=signOut
          icon="sign-out-alt"
          text="Sign out"
          className="p-0 pl-1"
        )#btn-signout
      TodoSearch(
        onUpdateFilterKeywords=updateFilterKeywords
        filterKeyWords=filterKeywords
      )
      TodoFilterList(
        onUpdateFilterState=updateFilterState
        currentState=filterState
      )
      Display.mb-3.mt-3#todo_route_heading Todo list
      TodoForm(
        onAddTodo=addTodo
      )

      CSSTransition(
        in=isTodosEmpty
        timeout=300
        classNames="Slide"
        unmountOnExit
      )
        EmptyTextWrapper.pt-3.pl-3
          FontAwesomeIcon(
            className="fa-fw"
            icon="calendar-check"
          )
          |  Congratulation! you got no todo left
      CSSTransition(
        in=!isTodosEmpty
        timeout=300
        classNames="Slide"
        unmountOnExit
      )
        div
          TodoList(
            todos=todos
            onRemoveTodo=this.removeSyncTodo
            onUpdateTodo=this.updateSyncTodo
          )
          TodoList(
            todos=pendingAddTodoList
            onRemoveTodo=this.removeUnsyncTodo
            onUpdateTodo=this.updateUnsyncTodo
          )
    `
  }
}

export default connect(
  (state) => {
    let {auth: {
      user: {
        uid,
        displayName
      }
    }, filter: {
      filterState,
      filterKeywords
    }} = state

    // Memoized selector
    return ({
      uid,
      displayName,
      todos: getVisibleTodosFilteredByKeyword(state),
      pendingAddTodoList: getVisibleUnsyncTodosFilteredByKeyword(state),
      isTodosEmpty: isTodosEmpty(state),
      filterState,
      filterKeywords
    })
  },
  Object.assign({}, authActions, todoActions, filterActions)
)(Todo)

Todo.propTypes = {
  filterKeywords: propTypes.string,
  addTodo: propTypes.func,
  todos: propTypes.instanceOf(List),
  displayName: propTypes.string,
  signOut: propTypes.func,
  updateFilterState: propTypes.func,
  updateFilterKeywords: propTypes.func,
  filterState: propTypes.string,
  pendingAddTodoList: propTypes.instanceOf(List),
  isTodosEmpty: propTypes.bool,
  removeTodo: propTypes.func,
  updateTodo: propTypes.func,
  onAddTodo: propTypes.func
}