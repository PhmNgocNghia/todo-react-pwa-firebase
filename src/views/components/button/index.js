import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
export default button