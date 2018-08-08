import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import propTypes from 'prop-types'

const button = ({text, icon, onClick, id, className}) => pug`
  button(
    onClick=onClick
    id=id
    className=className
  ).btn.btn-link.pb-1
    FontAwesomeIcon(
      icon=icon
      className="fa-fw"
    )
    |&nbsp;
    =text
`

button.propTypes = {
  text: propTypes.string,
  icon: propTypes.string,
  onClick: propTypes.func,
  id: propTypes.string,
  className: propTypes.string
}

export default button