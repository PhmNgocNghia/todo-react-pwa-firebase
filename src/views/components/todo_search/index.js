import React from 'react'
import styled from 'styled-components';

const TextInputGroupWrapper = styled.div`
  & > input{
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
const TodoSearch = ({onUpdateFilterKeywords}) => pug`
div
  TextInputGroupWrapper.position-relative
    input(
      id="todo_search_input"
      placeholder="Hi, i'm a search box"
      onChange=${(e)=>{
        onUpdateFilterKeywords(e.target.value)
      }}
    ).form-control
`

export default TodoSearch