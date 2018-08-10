// This snapshoot is result of child_added/updated/removed
export let fireBaseSnapShootToTodoItem = (snapshoot) => {
  return {
    key: snapshoot.key,
    ...snapshoot.val()
  }
}