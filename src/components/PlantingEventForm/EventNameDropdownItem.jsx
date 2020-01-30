import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  name: {
    flex: 1
  },
  type: {
    fontSize: 16,
    fontWeight: 300
  }
})

export default class EventNameDropdownItem extends Component{
  static propTypes = {
    item: PropTypes.object,
    styles: PropTypes.object
  };
  static defaultProps = {
    styles
  };

  render () {
    const {styles, item} = this.props
    return (
      <div style={styles.container}>
        <div style={styles.name}>{item.text}</div>
        <div style={styles.type}>{item.type}</div>
      </div>
    );
  }
}