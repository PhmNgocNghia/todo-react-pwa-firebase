
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Button from '../button.js'
import Checkbox from '../checkbox'
import TodoItem from './index';
import TodoItemName from '../todo_item_name'

const defaultProp = {
  todo: {
    name: 'test',
    completed: false,
    key: '123'
  }
}

describe('Todo Item', function() {
  // Render
  it('should render input, checkbox delete, edit button when not in edit mode', function () {
    const shallowTodoItem = shallow(<TodoItem {...defaultProp}/>)
    const Buttons = shallowTodoItem.find(Button)
    expect(shallowTodoItem.find(TodoItemName)).toHaveLength(1)
    expect(shallowTodoItem.find(Checkbox)).toHaveLength(1)
    expect(Buttons).toHaveLength(2)
    expect(Buttons.find({
      icon:"edit",
      text:"Update"
    })).toHaveLength(1)
    expect(Buttons.find({
      icon:"trash",
      text:"Delete"
    })).toHaveLength(1)
  })

  it('should render input, change, go back button when not in edit mode', function () {
    const shallowTodoItem = shallow(<TodoItem {...defaultProp}/>)
    shallowTodoItem.find('.btn-update').simulate('click')
    const Buttons = shallowTodoItem.find(Button)
    expect(shallowTodoItem.find('input')).toHaveLength(1)
    expect(Buttons).toHaveLength(2)
    expect(Buttons.find({
      icon:"edit",
      text:"Change"
    })).toHaveLength(1)
    expect(Buttons.find({
      icon:"window-close",
      text:"Go back"
    })).toHaveLength(1)
  })
  // State
  it('should go edit mode when press edit button', function () {
    const shallowTodoItem = shallow(<TodoItem {...defaultProp}/>)
    shallowTodoItem.find('.btn-update').simulate('click')
    expect(shallowTodoItem.state('isEditMode')).toBeTruthy()
  })

  it('should go back when press edit button', function () {
    const shallowTodoItem = shallow(<TodoItem {...defaultProp}/>)
    shallowTodoItem.find('.btn-update').simulate('click')
    shallowTodoItem.find('.btn-goBack').simulate('click')
    expect(shallowTodoItem.state('isEditMode')).toBeFalsy()
  })

  // Mock function
  it('should call delete function when press delete button', function () {
    const mockFunctionProps = {
      ...defaultProp,
      onRemoveTodo: jest.fn()
    }
    const shallowTodoItem = shallow(<TodoItem {...mockFunctionProps}/>)
    shallowTodoItem.find('.btn-delete').simulate('click')
    expect(mockFunctionProps.onRemoveTodo).toHaveBeenCalled()
    expect(mockFunctionProps.onRemoveTodo).toHaveBeenCalledWith(defaultProp.todo)
  })

  it('should not call update function when press change button and text is not change', () => {
    const mockFunctionProps = {
      ...defaultProp,
      onUpdateTodo: jest.fn()
    }
    const shallowTodoItem = shallow(<TodoItem {...mockFunctionProps}/>)
    shallowTodoItem.find('.btn-update').simulate('click')
    shallowTodoItem.find('.btn-change').simulate('click')
    expect(mockFunctionProps.onUpdateTodo).toHaveBeenCalledTimes(0)
  })

  it('should call update function when press change button and text is not empty', () => {
    const mockFunctionProps = {
      ...defaultProp,
      onUpdateTodo: jest.fn()
    }
    const shallowTodoItem = shallow(<TodoItem {...mockFunctionProps}/>)
    shallowTodoItem.find('.btn-update').simulate('click')
    shallowTodoItem.find('input').simulate('change', {
      target: {value: 'newVal'}
    })
    shallowTodoItem.find('.btn-change').simulate('click')
    expect(mockFunctionProps.onUpdateTodo).toHaveBeenCalled()
    expect(mockFunctionProps.onUpdateTodo).toHaveBeenCalledWith({
      name: 'newVal',
      completed: false,
      key: '123'
    })
  })

  it('should call remove function when press change button and text empty', () => {
    const mockFunctionProps = {
      ...defaultProp,
      onRemoveTodo: jest.fn()
    }
    const shallowTodoItem = shallow(<TodoItem {...mockFunctionProps}/>)
    shallowTodoItem.find('.btn-update').simulate('click')
    shallowTodoItem.setState({
      newTodoName: ''
    })
    shallowTodoItem.find('.btn-change').simulate('click')
    expect(mockFunctionProps.onRemoveTodo).toHaveBeenCalled()
    expect(mockFunctionProps.onRemoveTodo).toHaveBeenCalledWith(defaultProp.todo)
  })

  it('should toggle todo completed true when click checkbox', () => {
    const mockFunctionProps = {
      ...defaultProp,
      onUpdateTodo: jest.fn()
    }

    const shallowTodoItem = shallow(<TodoItem {...mockFunctionProps}/>)
    const shallowCheckbox = shallowTodoItem.find(Checkbox).dive()
    shallowCheckbox.find('input').simulate('change')
    expect(mockFunctionProps.onUpdateTodo).toHaveBeenCalled()
    expect(mockFunctionProps.onUpdateTodo).toHaveBeenCalledWith({
      ...defaultProp.todo,
      completed: true
    })
  })

  it('should toggle todo completed false when click checkbox', () => {
    const mockFunctionProps = {
      todo: {
        ...defaultProp.todo,
        completed: true
      },
      onUpdateTodo: jest.fn()
    }

    const shallowTodoItem = shallow(<TodoItem {...mockFunctionProps}/>)
    const shallowCheckbox = shallowTodoItem.find(Checkbox).dive()
    shallowCheckbox.find('input').simulate('change')
    expect(mockFunctionProps.onUpdateTodo).toHaveBeenCalled()
    expect(mockFunctionProps.onUpdateTodo).toHaveBeenCalledWith({
      ...defaultProp.todo,
      completed: false
    })
  })

  // Snapshoot
  it('should match snap shoot when not in edit mode', function () {
    const shallowTodoItem = shallow(<TodoItem {...defaultProp}/>)
    let Json = toJson(shallowTodoItem)
    expect(Json).toMatchSnapshot()
  })

  it('should match snap shoot when in edit mode', function () {
    const shallowTodoItem = shallow(<TodoItem {...defaultProp}/>)
    shallowTodoItem.setState({
      isEditMode: true
    })
    let Json = toJson(shallowTodoItem)
    expect(Json).toMatchSnapshot()
  })
})