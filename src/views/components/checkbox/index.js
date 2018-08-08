import React from 'react'
import styled from 'styled-components';

const CheckWrapper = styled.div`
  height: 20px
`

const Checkbox = ({id, checked, onCheck}) => pug`
  CheckWrapper
    input(
      type="checkbox"
      id=id
      checked=checked
      onChange=onCheck
    )
    label(htmlFor=id).mr-1

`

export default Checkbox