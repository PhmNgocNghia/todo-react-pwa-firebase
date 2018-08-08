import styled from 'styled-components'
import React from 'react'

const TodoFiltersItemWraper = styled.div`
    &:last-child{
      & > span {
        display: none
      }

      & > button {
        padding-right: 0 !important
      }
    }

    &:not(:last-child) {
      border-radius: 0
    }

    & > button.active {
      font-weight: bold !important
    }
`

const TodoFilterItem = ({state, currentState, onClick}) => pug`
    TodoFiltersItemWraper
      button(
        id=state.name
        className="btn btn-link px-2 py-0 my-1 " + (state.name === currentState ? 'active' : '')
        onClick=${()=>{
          console.log(currentState)
          onClick(state.name)
        }}
      )=state.text
      span |
`
export default TodoFilterItem