import {
  Record
} from 'immutable';

let filterState = new Record({
  filterState: 'SHOW_ALL',
  filterKeywords: ''
})

export default (previousState = new filterState(), action) => {
  switch(action.type) {
    case 'UPDATE_FILTER_STATE':
      return previousState.set('filterState', action.state)

    case 'UPDATE_FILTER_KEYWORDS':
      return previousState.set('filterKeywords', action.keyWords)

    default:
      return previousState
  }
}