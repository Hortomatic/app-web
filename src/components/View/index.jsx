import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TextInput
} from 'react-native-web'

export default class CustomView extends Component {
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
    overflow: 'hidden'
  }
})

export { CustomView as View }
export Cover from './Cover'
export Row from './Row'
export Col from './Col'

export {Text}
export {Image}
export {ScrollView}
export {TextInput}
