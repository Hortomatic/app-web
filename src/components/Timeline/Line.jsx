import React from 'react'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'

import {View} from 'components/View'


export default class Line extends React.Component {
  static propTypes = {
    plotX: React.PropTypes.func,
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    style: React.PropTypes.object
  };

  render () {
    const {plotX, yPos, from, to, appearance, style} = this.props
    return (
      <line x1={plotX(from)} x2={plotX(to)} y1={yPos} y2={yPos} strokeDasharray={[10,appearance==='solid'?0:10]} style={{...defaultStyle, ...style}} />
    )
  }
}


const defaultStyle = {
  strokeLinecap: 'round',
  strokeWidth: 4
}