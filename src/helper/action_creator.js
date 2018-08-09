import {actions as toastrActions} from 'react-redux-toastr'

export function camelToUpperUnderScore (camel) {
  let groupSelector = /[A-Z][^A-Z]+|^[^A-Z]+/g
  let extractedGroups = []
  let extractedGroup

  // Extract actionName into [actin,Name]
  do {
    extractedGroup = groupSelector.exec(camel)
    if (extractedGroup) {
      extractedGroups.push(extractedGroup[0])
    }
  } while (extractedGroup)

  // Transform [actin,Name] into ACTION_NAME
  let upperUnderScore = extractedGroups.join('_').toUpperCase()
  return upperUnderScore
}

/**
 * A function that return a function. ArgsName and their value which is args will be
 * Add to return object by using object[argsName[index]] = args[index]. Assign key
 * and it's value to a object.
 */
export let makeActionCreatorFunction = (type, ...argNames) => (...args) => {
  let action = {type}

  // can be reverse: args.forEach
  argNames.forEach((argName, index) => {
    // argName is element at index of arr argNames
    action[argName] = args[index]
  })

  return action
}

// Will be export into object
// Above is the property of camelActionName, and camelActionName will be export into object to use
export let makeActionCreatorPropery = (camelActionName, ...args) => {
  let groupSelector = /[A-Z][^A-Z]+|^[^A-Z]+/g
  let extractedGroups = []
  let extractedGroup

  // Extract actionName into [actin,Name]
  do {
    extractedGroup = groupSelector.exec(camelActionName)
    if (extractedGroup) {
      extractedGroups.push(extractedGroup[0])
    }
  } while (extractedGroup)

  // Transform [actin,Name] into ACTION_NAME
  let transformActionType = extractedGroups.join('_').toUpperCase()
  return {
    [camelActionName]: makeActionCreatorFunction(transformActionType, ...args)
  }
}

/**
 * actionArgs params
 * success: array
 * failure: array
 */
export let makeAsyncAction = (camelActionName, actionArgs) => {
  let result = {}
  let states = ['success', 'failure']

  for (let state of states) {
    // transform into nameType
    let camelActionNameState = `${camelActionName}${state.charAt(0).toUpperCase()}${state.substring(1)}`

    // Readable
    let ArgsOfActionType = actionArgs && actionArgs[state] ? actionArgs[state] : []

    // transform camelActionNameState into CAMEL_ACTION_NAME_STATE
    if (state==='success') {
      result = Object.assign({}, result, makeActionCreatorPropery(camelActionNameState, ArgsOfActionType))
    } else {
      let type = camelToUpperUnderScore(camelActionNameState)

      // Failutre dispatch a thunk function that add notification with type error
      result[camelActionNameState] = (error, ...args) => {
        return (dispatch) => {
          // Some error can be ignored
          if ([
            'auth/cancelled-popup-request'
          ].includes(error.code))
            return

          dispatch(toastrActions.add({
            type: 'error',
            title: error.code,
            message: error.message,
            options: {
              showCloseButton:true
            }
          }))

          // Optional failure payload
          dispatch({
            type,
            error
          })
        }
      }
    }
  }

  return result
}