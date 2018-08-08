import React from 'react';
import TodoFilterItem from '../todo_filter_item'

const TodoFilterList  = ({currentState, onUpdateFilterState}) => (
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

export default TodoFilterList