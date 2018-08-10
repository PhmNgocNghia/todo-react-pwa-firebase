import 'jest-extended'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk] // add your middlewares like `redux-thunk`

global.mockStore = configureStore(middlewares)
Enzyme.configure({ adapter: new Adapter() })