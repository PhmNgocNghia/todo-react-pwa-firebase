import styled from 'styled-components'
import React, { Component } from 'react'
const DisplayText = styled.h1`
  font-family: 'Lobster', cursive;
  letter-spacing: 2px;
  text-shadow: 2px 4px 1px rgba(75, 170, 217, 0.75);
  color: white;
  text-align: center;
`



export default class Display extends Component {
  shouldComponentUpdate () {
    return false
  }

  render() {
    return pug`
      DisplayText=this.props.children
    `
  }
}
