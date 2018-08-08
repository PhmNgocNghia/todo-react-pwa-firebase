import {
  makeActionCreatorPropery
} from '../../helper/action_creator'

export default {
  ...makeActionCreatorPropery('showLoading'),
  ...makeActionCreatorPropery('hideLoading')
}