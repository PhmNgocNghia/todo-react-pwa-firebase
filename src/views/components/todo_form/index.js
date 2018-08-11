import React from 'react'
import styled from 'styled-components'
import Button from '../button.js'
import propTypes from 'prop-types'

const TextInputGroupWrapper = styled.div`
  & > button {
    position: absolute;
    right: 0;
    top: 0;
  }

  & > input,
  & > button,
  & > button:hover {
    color: #ffffff;
  }

  & > input:focus {
    box-shadow: 0 1px 1px rgba(0,0,0,0.075) inset, 0 0 6px rgb(65, 152, 195);
    outline: 0 none;
  }

  & > input {
    &,
    &:active,
    &:hover,
    &:focus {
      padding-right: 50px;
      color: #ffffff;
      background: transparent;
      outline-color: white;
      border: 1px solid rgba(255,255, 255 , 0.5)
    }
  }
`

class TodoForm extends React.PureComponent {
  constructor(props) {
    super (props)
    this.state = {
      todoName: ''
    }
  }

  addTodo = () => {
    this.props.onAddTodo(this.state.todoName)
    this.setState({
      todoName: ''
    })
  }

  render () {
    return pug`
div
  TextInputGroupWrapper.position-relative
    input(
      placeholder='Enter job to be done'
      value=this.state.todoName
      onChange=${(e)=>{
        this.setState({todoName: e.target.value})
      }}
      onKeyUp=${(e)=>{
        if (e.keyCode === 13 && this.state.todoName !== '') {
          this.addTodo()
        }
      }}
    ).form-control#todo_form_input
    if (this.state.todoName)
      Button(
        onClick=this.addTodo
        icon="plus-circle"
        text="add"
      )
      `
  }
}

TodoForm.propTypes = {
  onAddTodo: propTypes.func
}

export default TodoForm