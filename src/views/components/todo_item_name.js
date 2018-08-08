import styled from 'styled-components'

export default styled.button`
  display: block;
  background: transparent;
  border: 0;
  color: white;

  cursor: pointer;
  &,
  &:hover {
    text-decoration: ${props => {
      return props.completed ? 'line-through' : 'none';
    }} !important;
  }
  &:focus {
    outline: 0;
  }
`