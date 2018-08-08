import React from 'react'
import styled from 'styled-components'
import propTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Display from '../../components/display'
import Card from '../../components/transparentCard'
import authActions from '../../../store/auth/actions'

import {
  connect
} from 'react-redux'

const SocialButton = styled.button`
  &>span {
    font-size: 1.4em !important;
  }

  &:last-of-type {
    margin-bottom: 0 !important
  }
`



class Authenticate extends React.Component {
  constructor (props) {
    super(props)

    const {
      signInWithFacebook,
      signInWithGithub,
      signInWithGoogle,
      signInWithTwitter
     } = this.props

    this.state = {
      authProviders: [
        {
          title: 'facebook',
          onClick: signInWithFacebook
        },

        {
          title: 'google',
          onClick: signInWithGoogle
        },
        {
          title: 'twitter',
          onClick: signInWithTwitter
        },
        {
          title: 'github',
          onClick: signInWithGithub
        }
      ]
    }
  }

  render () {
    return pug`
      div.d-flex.justify-content-center.align-items-center
        Card.p-5
          Display.mb-4#auth_route_heading TodoList
          each authProvider, index in this.state.authProviders
            SocialButton(
              key=index
              className ='btn-'+authProvider.title
              onClick=authProvider.onClick
            ).btn.btn-block.btn-social.btn-lg.mb-4
              span
                FontAwesomeIcon(
                  icon=['fab', authProvider.title]
                )
              | Continue with #{this.upperCaseFirst(authProvider.title)}
        button(
          id='btn_signin_dummy'
          onClick=this.props.signInDummyAccount
        ).d-none
    `
  }

  upperCaseFirst (name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
}

Authenticate.propTypes = {
  signInWithFacebook: propTypes.func,
  signInWithGithub: propTypes.func,
  signInWithGoogle: propTypes.func,
  signInWithTwitter: propTypes.func
}

export default connect(
  ({auth: {user}}) => ({user}),
  authActions
)(Authenticate)