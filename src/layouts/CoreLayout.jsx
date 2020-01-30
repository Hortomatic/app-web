import React from 'react'

import { Button, ButtonPanel } from 'components/Buttons'
import View, { Cover, Row } from 'components/View'

import NavBar from 'views/navBarUI'
import EditEventUI from 'views/editEventUI'

require('static/css/App.css')

function CoreLayout ({children}) {
  return (
  <Cover className="App-main">
    <Cover className="fullWrap App-mainPanelSplit">
      <NavBar />
      <Row>
        {children}
        <EditEventUI />
      </Row>
    </Cover>
  </Cover>
  )
}

CoreLayout.propTypes = {
  children: React.PropTypes.element
}

export default CoreLayout
