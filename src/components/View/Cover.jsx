import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native-web'

export default class Cover extends Component {
  render() {
    let {children, style, ...props} = this.props
    return (
      <View style={{...defaultStyles.view, ...style}} {...props}>
        {children}
      </View>
    );
  }
}

const defaultStyles = StyleSheet.create({
  view: {
  	display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'hidden'
  }
})


