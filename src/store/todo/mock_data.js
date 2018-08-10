import {
  actions
} from 'react-redux-toastr'

import {actions as toastrActions} from 'react-redux-toastr'
import { addTodo } from './actions';

export default {
  name: 'test',
  editedName: 'tet',
  key: 'test',
  TodoReturn: {
    name: 'test',
    key: undefined,
    completed: false
  },

  editTodo: {
    name: 'test',
    key: 'test',
    completed: false
  },

  error: {
    code: 'test',
    message: 'test'
  },

  toasrAction: toastrActions.add({
    type: 'error',
    title: 'test',
    message: 'test',
    options: {
      showCloseButton:true
    }
  })
}