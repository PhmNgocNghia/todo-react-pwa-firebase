
import React from 'react';
import { shallow} from 'enzyme';

import Foo from './index';

describe('A suite', function() {
  it('should render without throwing an error', function() {
    expect(shallow(<Foo />)).toMatchSnapshot();
  });
})