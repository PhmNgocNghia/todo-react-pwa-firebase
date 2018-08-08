import {
  Record
} from 'immutable';

let authState = new Record({
  user: null
})


export default (previousState = new authState(), action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
    case 'INIT_APPLICATION_SUCCESS':
      return previousState.set('user', action.user)
    case 'SIGN_OUT_SUCCESS':
      // Hack for CSS Transition
      return previousState.set('user', {
        displayName: '',
        uid: ''
      })

    default:
      return previousState;
  }
}