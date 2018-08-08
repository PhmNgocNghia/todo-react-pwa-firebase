
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Button from '../button.js'
import TodoForm from './index';

describe('Todo form', function() {
  // Render
  it('should render input and not render button when have no text inside', function() {
    const shadowTodoForm = shallow(<TodoForm />)
    const Inputs = shadowTodoForm.find('input')
    expect(Inputs.length).toBe(1)
    expect(Inputs.find({
      placeholder:'Enter job to be done'
    }).length).toBe(1)
    expect(shadowTodoForm.find(Button).length).toBe(0)
  })

  it('should render input and add button when have text inside', function () {
    const shadowTodoForm = shallow(<TodoForm />)
    shadowTodoForm.find('input').simulate('change', {
      target: {
        value: 'test'
      }
    })
    let Buttons = shadowTodoForm.find(Button)
    expect(shadowTodoForm.find('input').length).toBe(1)
    expect(Buttons.length).toBe(1)
    expect(Buttons.find({
      icon:"plus-circle",
      text:"add"
    }).length).toBe(1)
  })

  // State
  it('should set state when type in', function() {
    const shadowTodoForm = shallow(<TodoForm />)
    shadowTodoForm.find('input').simulate('change', {
      target: {
        value: 'test'
      }
    })
    expect(shadowTodoForm.state('todoName')).toBe('test')
  })


  // Mock function
  it('should call addTodo when press enter and have text inside', function () {
    const props = {
      onAddTodo: jest.fn()
    }

    const shadowTodoForm = shallow(<TodoForm {...props} />)
    shadowTodoForm.setState({
      todoName: 'test'
    })
    shadowTodoForm.find('input').simulate('keyUp', {
      keyCode: 13
    })
    expect(props.onAddTodo).toHaveBeenCalled()
    expect(props.onAddTodo).toBeCalledWith('test')
  })

  it('should not call addTodo when press todo and not have text inside', function () {
    const props = {
      onAddTodo: jest.fn()
    }

    const shadowTodoForm = shallow(<TodoForm {...props} />)
    shadowTodoForm.find('input').simulate('keyUp', {
      keyCode: 13
    })
    expect(props.onAddTodo).toHaveBeenCalledTimes(0)
  })

  // Snapshoot
it('should match snapshoot when have no text', function () {
    const shadowTodoForm = shallow(<TodoForm />)
    let Json = toJson(shadowTodoForm)
    expect(Json).toMatchSnapshot()
  })

  it('should match snapshoot when have text', function () {
    const shadowTodoForm = shallow(<TodoForm />)
    shadowTodoForm.setState({
      todoName: 'todoName'
    })
    let Json = toJson(shadowTodoForm)
    expect(Json).toMatchSnapshot()
  })
})