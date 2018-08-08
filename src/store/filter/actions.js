import {
  makeActionCreatorPropery
} from '../../helper/action_creator'

export default {
  ...makeActionCreatorPropery('updateFilterState', 'state'),
  ...makeActionCreatorPropery('updateFilterKeywords', 'keyWords')
}