import React from 'react'
import styled from 'styled-components'

// TODO: strip unused class with purify-css
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-social/bootstrap-social.css'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import 'animate.css'
import './base.sass'

// Library
import {
  connect
} from 'react-redux'
import authActions from './store/auth/actions'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import propTypes from 'prop-types'

// React-router
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

// Builtin component
import Auth from './views/pages/auth'
import Todo from './views/pages/todo'
import Display from './views/components/display'
import Card from './views/components/transparentCard'

// Custom component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReduxToastr from 'react-redux-toastr'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTwitter,
  faGithub,
  faGoogle,
  faFacebook
 } from '@fortawesome/free-brands-svg-icons'

 import {
  faSync,
  faTrash,
  faEdit,
  faWindowClose,
  faSignOutAlt,
  faUser,
  faFilter,
  faPlusCircle,
  faCalendarCheck
 } from '@fortawesome/free-solid-svg-icons'

 library.add(
  faFacebook,
  faTwitter,
  faGithub,
  faGoogle,
  faSync,
  faTrash,
  faEdit,
  faWindowClose,
  faSignOutAlt,
  faUser,
  faFilter,
  faPlusCircle,
  faCalendarCheck
 )

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  font-family: 'Muli', sans-serif;
  background: #00c6ff;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #0072ff, #00c6ff);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #0072ff, #00c6ff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`

const SpinnerWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 4em;
    color: white;
`

const ReponsiveWrapper = styled.div`
 max-width: 600px
`

class App extends React.Component {
  constructor(props) {
    super (props)
  }

   componentDidMount () {
     /*Init auth*/
    this.props.initApplication()
      /** Setup sync */
   }

  render () {
    return pug`
Wrapper.d-flex
  CSSTransition(
    in=this.props.loading
    timeout=300
    classNames="fade"
    unmountOnExit
  )
      SpinnerWrapper.justify-content-center.align-items-center.d-flex.flex-column
        Card.p-5
          div.d-flex.justify-content-center.mb-3
            FontAwesomeIcon(
              icon="sync"
              size="xs"
              spin)
          Display#loading-text Loading
  CSSTransition(
    in=!this.props.loading
    timeout=300
    classNames="fadeSlide"
    unmountOnExit
  )
    div.d-flex.justify-content-center.align-items-center.flex-column.w-100
      ReduxToastr(
        progressBar
        timeOut=5000
        position="top-right"
        preventDuplicates
        transitionIn="bounceIn"
        transitionOut="bounceOut"
      )
      Router
        ReponsiveWrapper
          TransitionGroup
            if this.props.user === null || this.props.user.uid === ''
              CSSTransition(
                timeout=1000
                classNames="fadeSlide"
              )
                Route(
                  path="/"
                  component=Auth
                )
            else if this.props.user.uid != ''
              CSSTransition(
                timeout=1000
                classNames="fadeSlide"
              )
                Route(
                  path="/"
                  component=Todo
                )
    `
  }
}

App.propTypes = {
  initApplication: propTypes.func
}

export default connect(
  ({auth: {user}, loading}) => ({user, loading}),
  authActions
)(App)