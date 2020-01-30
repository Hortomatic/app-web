import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native-web'

export default class Row extends Component {
  render() {
    let {children, style, ...props} = this.props
    return (
      <View style={{...defaultStyles.row, ...style}} {...props}>
        {children}
      </View>
    );
  }
}

const defaultStyles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'hidden'
  }
})
