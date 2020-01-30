import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'
import createGetStyle from 'utils/getStyle'

import {View, Row, Col, Text} from 'components/View'
import {IconButton} from 'components/Buttons'

const defaultStyles = StyleSheet.create({
  container: {
    flexShrink: 0,
    flexGrow: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  hotKey: {
    flexDirection: 'row',
    flexBasis: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hotKeyPart: {
    fontFamily: '"Helvetica Neue", sans-serif',
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    fontSize: 25,
    width: 35,
    height: 35,
    marginTop: -3,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 4,
    backgroundColor: '#78c76d',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    cursor: 'pointer'
  }
})

export default class AddEventButton extends Component{
  static propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.oneOf(['add']),
    keys: PropTypes.array,
    onClick: PropTypes.func,
    styles: PropTypes.object
  };
  static defaultProps = {
    styles: defaultStyles,
    keys: []
  };

  handleClick = () => {
    this.props.onClick()
  };

  render () {
    let {
      label,
      icon,
      keys,
      styles,
      ...props
    } = this.props;

    const getStyle = createGetStyle({...defaultStyles, ...styles})

    return (
      <Row style={getStyle('container')}
        onClick={this.handleClick}
        {...props}>
        {keys &&
          <View style={getStyle('hotKey')}>
            {keys.map(key=>(
            typeof key === 'string'
              ? <View style={getStyle('hotKeyPart')}>
                {key}
              </View>
              : <View style={getStyle('hotKeyPart')}>
                {key}
              </View>
            ))}
          </View>
        }
        <View style={getStyle('button')}>+</View>
        <Text style={getStyle('label')}>{label}</Text>
      </Row>
    )
  }
}
