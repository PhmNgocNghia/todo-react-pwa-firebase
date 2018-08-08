
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import TodoSearch from './index';

describe('Todo Search', function() {
  // Render
  it('should render input when no text inside', function () {
    const shallowTodoSearch = shallow(<TodoSearch/>)
    expect(shallowTodoSearch.exists('input')).toBeTruthy()
  })

  // Event
  it('should call search todo when key press', function () {
    const mockUpdateFunc = jest.fn()
    const shallowTodoSearch = shallow(<TodoSearch onUpdateFilterKeywords={mockUpdateFunc} />)
    shallowTodoSearch.find('input').simulate('change', {target: {value: 'test'}})
    expect(mockUpdateFunc).toBeCalled()
  })


  // Snapshoot
  it('should match snapshoot', function () {
    const shallowTodoSearch = shallow(<TodoSearch/>)
    expect(toJson(shallowTodoSearch)).toMatchSnapshot()
  })
})