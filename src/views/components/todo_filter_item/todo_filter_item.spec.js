
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import TodoFilterItem from './index';

describe('Todo Search', function() {
  // Render
  it('should render button with active class when current state equal state', function () {
    const props = {
      state: {
        name: 'A',
        text: 'a'
      },
      currentState: 'A'
    }

    let shallowTodoFilterItem = shallow(<TodoFilterItem {...props} />)
    expect(shallowTodoFilterItem.find('button').hasClass('active')).toBeTruthy()
  })

  it('should not render button without active class when current state not equal state', function () {
    const props = {
      state: {
        name: 'A',
        text: 'a'
      },
      currentState: 'B'
    }

    let shallowTodoFilterItem = shallow(<TodoFilterItem {...props} />)
    expect(shallowTodoFilterItem.find('button').hasClass('active')).toBeFalsy()
  })

  // Event
  it('should run onclick when press', function () {
    const props = {
      state: {
        name: 'A',
        text: 'a'
      },
      currentState: 'B',
      onClick: jest.fn()
    }

    let shallowTodoFilterItem = shallow(<TodoFilterItem {...props} />)
    shallowTodoFilterItem.find('button').simulate('click')
    expect(props.onClick).toHaveBeenCalled()
  })

  // Snapshoot
  it('should match snapshoot when state equal current state', function () {
    const props = {
      state: {
        name: 'A',
        text: 'a'
      },
      currentState: 'A'
    }

    let shallowTodoFilterItem = shallow(<TodoFilterItem {...props} />)
    expect(shallowTodoFilterItem).toMatchSnapshot()
  })

  it('should match snapshoot when state not equal current state', function () {
    const props = {
      state: {
        name: 'A',
        text: 'a'
      },
      currentState: 'B'
    }

    let shallowTodoFilterItem = shallow(<TodoFilterItem {...props} />)
    expect(toJson(shallowTodoFilterItem)).toMatchSnapshot()
  })
})