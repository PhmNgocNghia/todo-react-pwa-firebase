import { combineReducers } from 'redux'
import authReducer from './auth/reducer'
import todoReducer from './todo/reducer'
import filterReducer from './filter/reducer';
import loadingReducer from './loading/reducer';
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
  auth: authReducer,
  todo: todoReducer,
  toastr: toastrReducer,
  filter: filterReducer,
  loading: loadingReducer
})