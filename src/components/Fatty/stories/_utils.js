import React from 'react'

const wrapStyle = {
  backgroundColor: '#ddd',
  width:'100%',
  minHeight:'100vh',
  paddingTop: 10,
  paddingRight: 10,
  paddingBottom: 10,
  paddingLeft: 10
}

export function wrap (component, styles={}) {
  return (
    <div style={{...wrapStyle, ...styles}}>
      {component}
    </div>
  )
}
