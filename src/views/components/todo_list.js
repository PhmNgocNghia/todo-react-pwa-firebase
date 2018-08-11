import React from 'react'
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group'
import TodoItem from './todo_item'
import PropTypes from 'prop-types'
import Immutable, {
  List
} from 'immutable'
/**
 * Render TodoItem and apply CSS transition when
 * add
 * remove
 * Add function props to todoItem
 * removeTodo
 * updateTodo
 */

class TodoList extends React.Component {
  shouldComponentUpdate (newProps) {
    if(Immutable.is(newProps.todos, this.props.todos))
      return false
    else
      return true
  }

  render () {
    const {todos, onRemoveTodo, onUpdateTodo} = this.props
    return (
  <TransitionGroup>
    {todos.map((todo)=>(
      <CSSTransition
        key = {todo.key}
        timeout={200}
        classNames="Slide"
      >
        <TodoItem
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          onRemoveTodo={onRemoveTodo}
        />
      </CSSTransition>
    ))}
  </TransitionGroup>
    )
  }
}

TodoList.propTypes = {
  todos: PropTypes.instanceOf(List),
  onRemoveTodo: PropTypes.func,
  onUpdateTodo: PropTypes.func
}

export default TodoList