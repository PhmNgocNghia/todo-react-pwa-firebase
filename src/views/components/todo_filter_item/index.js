import styled from 'styled-components'
import React from 'react'
import PropTypes from 'prop-types'

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

class TodoFilterItem extends React.PureComponent {
  render () {
    const {state, currentState, onClick} = this.props
    return pug`
      TodoFiltersItemWraper
      button(
        id=state.name
        className="btn btn-link px-2 py-0 my-1 " + (state.name === currentState ? 'active' : '')
        onClick=${()=>{
          onClick(state.name)
        }}
      )=state.text
      span |
    `
  }
}

TodoFilterItem.propTypes = {
  currentState: PropTypes.string,
  onClick: PropTypes.func,
  state: PropTypes.shape({
    name: PropTypes
  })
}

export default TodoFilterItem