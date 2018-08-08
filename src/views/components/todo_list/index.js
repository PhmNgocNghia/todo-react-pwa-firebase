import React from 'react'
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group'
import TodoItem from '../todo_item'
import PropTypes from 'prop-types'
import {
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
const TodoList = ({todos = new List(), onRemoveTodo, onUpdateTodo}) => (
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

TodoList.propTypes = {
  todos: PropTypes.instanceOf(List),
  onRemoveTodo: PropTypes.func,
  onUpdateTodo: PropTypes.func
}

export default TodoList