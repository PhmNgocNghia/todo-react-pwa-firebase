import React from 'react'
import styled from 'styled-components';
import CheckBox from '../checkbox'
import Button from '../button'

const TodoItemWrapper = styled.div`
  border-bottom: 1px solid rgba(255,255,255 ,0.5);
  & > button:hover {
    text-decoration: underline
  }

  & > input {
    &,
    &:focus,
    &:hover,
    &:active {
      background: transparent;
      border: 0;
      color: white;
    }

    &:focus {
      box-shadow: none
    }
  }

  & label {
    cursor: pointer
  }
`

const TodoItemName = styled.button`
  display: block;
  background: transparent;
  border: 0;
  color: white;

  cursor: pointer;
  &,
  &:hover {
    text-decoration: ${props => {
      return props.completed ? 'line-through' : 'none';
    }} !important;
  }
  &:focus {
    outline: 0;
  }

`

class TodoItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditMode: false,
      newTodoName: ''
    }
  }

  toggleTodo = () => {
    const {
      onUpdateTodo,
      todo
     } = this.props
    onUpdateTodo(Object.assign({}, todo, {
      completed: !todo.completed
    }))
  }

  updateTodo = () => {
    const {
      todo,
      onRemoveTodo,
      onUpdateTodo
    } = this.props

    const {
      newTodoName
     } = this.state

    // Check if todo name
    if (this.state.newTodoName!==this.props.todo.name) {
      // if input with empty text
      if (newTodoName === '') {
        onRemoveTodo(todo)
      } else {
        onUpdateTodo(Object.assign({}, todo, {
          name: newTodoName
        }))
      }
    }

    // Toggle edit
    this.setState({
      isEditMode: false
    })
  }

  render() {
    const {
      todo,
      onRemoveTodo
    } = this.props

    const {
      name
    } = todo

    return pug`
    TodoItemWrapper.pt-3.pb-1.d-flex.align-items-center
      if (this.state.isEditMode)
        input(
          value=this.state.newTodoName
          onChange=${(e) => {
            this.setState({
              newTodoName: e.target.value
            })
          }}
          onKeyUp=${(e)=>{
            if (e.keyCode === 13) {
              this.updateTodo()
            } else if (e.keyCode === 27) {
              this.setState({
                isEditMode: false
              })
            }
          }}
        ).todo_item_input.form-control.pl-0
        Button(
          onClick=this.updateTodo
          icon="edit"
          text="Change"
        ).btn-change

        Button(
          onClick=${() => {
            this.setState({ isEditMode: false })
          }}
          icon="window-close"
          text="Go back"
        )
      else
        CheckBox(
          id=todo.key
          checked=todo.completed
          onCheck=this.toggleTodo
        )
        TodoItemName(
          completed=todo.completed
          onClick=this.toggleTodo
        ).todo_name.mr-auto=name
        Button(
          onClick=${() => {
            this.setState({
              isEditMode: true,
              newTodoName: name
            })
          }}
          icon="edit"
          text="Update"
        ).btn-update

        Button(
          onClick=${() => {
            onRemoveTodo(todo)
          }}
          icon="trash"
          text="Delete"
        ).btn-delete

    `
  }
}

export default TodoItem