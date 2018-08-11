import React, { PureComponent } from 'react'
import TodoFilterItem from './todo_filter_item'
import propTypes from 'prop-types'

export default class TodoFilterList extends PureComponent {
  render() {
    const {currentState, onUpdateFilterState} = this.props
    return (
      <div className="d-flex justify-content-end">
    {[
      {
        name: 'SHOW_ALL',
        text: 'View all'
      }, {
        name: 'SHOW_ACTIVE',
        text: 'active'
      }, {
        name: 'SHOW_COMPLETED',
        text: 'completed'
      },
    ].map(filterState=>(
      <TodoFilterItem
        key={filterState.name}
        state={filterState}
        currentState={currentState}
        onClick={onUpdateFilterState}>
      </TodoFilterItem>
    ))}
  </div>
    )
  }
}


TodoFilterList.propTypes = {
  currentState: propTypes.string,
  onUpdateFilterState: propTypes.func
}