import {
  camelToUpperUnderScore,
  makeActionCreatorFunction,
  makeActionCreatorPropery,
  makeAsyncAction
} from './action_creator'

import {actions as toastrActions} from 'react-redux-toastr'

describe('helper function', function () {
  it('should convert camel to upper under scoreconst using camelToUpperUnderScore', function () {
    expect(camelToUpperUnderScore('exampleCamelText')).toBe('EXAMPLE_CAMEL_TEXT')
  })

  it('should create action creator functionconst using makeActionCreatorFunction', function () {
    const funcCreated = makeActionCreatorFunction('ACTION_NAME', 'actionArg')
    expect(funcCreated).toBeFunction()
    expect(funcCreated('actionArgVal')).toEqual({
      type: 'ACTION_NAME',
      actionArg: 'actionArgVal'
    })
  })

  it('should create object with functionconst using makeActionCreatorPropery', function () {
    const objCreated = makeActionCreatorPropery('actionName', 'actionArg')
    expect(objCreated).toBeObject()
    expect(objCreated).toContainKey('actionName')
    expect(objCreated.actionName).toBeFunction()
  })

  it('should create actionconst using function created by makeActionCreatorPropery', function () {
    const objCreated = makeActionCreatorPropery('actionName', 'actionArg')
    expect(objCreated.actionName('actionArgVal')).toEqual({
      type: 'ACTION_NAME',
      actionArg: 'actionArgVal'
    })
  })

  it('should return objectconst using makeAsyncAction', function () {
    const objCreated = makeAsyncAction('actionName', {})
    expect(objCreated).toBeObject()
    expect(objCreated.actionNameSuccess).toBeFunction()
    expect(objCreated.actionNameFailure).toBeFunction()
  })

  it('should create actionconst using success action creator function created by makeActionCreatorPropery', function () {
    const objCreated = makeAsyncAction('actionName', {
      success: ['actionArg']
    })
    const objCreatedBySuccessFunction = objCreated.actionNameSuccess('actionArgVal')
    expect(objCreatedBySuccessFunction).toEqual({
      type: 'ACTION_NAME_SUCCESS',
      actionArg: 'actionArgVal'
    })
  })

  it('should dispatch toastraction and action creator using failure action creator function created by makeActionCreatorPropery', function () {
    const objCreated = makeAsyncAction('actionName', {
      failure: ['argName', 'argName2']
    })

    const error = {
      code: 'TEST',
      message: 'test'
    }
    const objCreatedByFailureFunction = objCreated.actionNameFailure(error, 'argVal', 'argVal2')
    const dispatch = jest.fn()
    objCreatedByFailureFunction(dispatch)
    expect(dispatch).toHaveBeenCalledTimes(2)

    // First function: toastraction add
    expect(dispatch.mock.calls[0][0]).toEqual(toastrActions.add({
      type: 'error',
      title: error.code,
      message: error.message,
      options: {
        showCloseButton:true
      }
    }))

    // Second function: return correct action creator
    expect(dispatch.mock.calls[1][0]).toEqual({
      type: 'ACTION_NAME_FAILURE',
      error,
      argName: 'argVal',
      argName2: 'argVal2'
    })
  })
})
