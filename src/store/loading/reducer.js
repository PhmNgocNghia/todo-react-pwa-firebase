export default (prevState = true, action) => {
  switch (action.type) {
    case 'SHOW_LOADING':
      return true

    case 'HIDE_LOADING':
      return false

    default:
      return prevState
  }
}