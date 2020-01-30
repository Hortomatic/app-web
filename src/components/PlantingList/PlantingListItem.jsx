import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'
import uncontrollable from 'uncontrollable'
import createGetStyle from 'utils/getStyle'

import {View, Text} from 'components/View'

const styles = StyleSheet.create({
  container: {
    height: 65,
    cursor: 'pointer',
    padding: 10
  },
  containerSelected: {

  },
  text: {
    color: '#5E5D55'
  },
  selected: {
    container: {
      backgroundColor: '#44B9F0'
    },
    text: {
      color: '#FFFFFF'
    }
  },
  hovered: {
    container: {
      backgroundColor: '#FCFBF0'
    },
    text: {
      color: '#44B9F0'
    }
  }
})

// partially apply styles to getStyle function
const getStyle = createGetStyle(styles)

class PlantingListItem extends Component{
  static propTypes = {
    item: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    onSelect: PropTypes.func,
    isHovered: PropTypes.bool,
    onHoverChange: PropTypes.func,
    onPlaceClick: React.PropTypes.func
  };
  static defaultProps = {
    isSelected: false
  };

  handleMouseEnter = (ev) => {
    this.props.onHoverChange(true)
  };

  handleMouseLeave = (ev) => {
    this.props.onHoverChange(false)
  };

  render () {
    const {item, onSelect, isSelected, isHovered, onPlaceClick} = this.props
    const uiState = {selected: isSelected, hovered: isHovered}
    const textStyle = getStyle('text', uiState)
    return (
      <View
        onClick={onSelect} style={getStyle('container', uiState)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Text style={textStyle}>{item.name}</Text>
        <Text style={textStyle}>
          <Text>
            {item.plantName}
          </Text>
          {item.place_id &&
            <Text onClick={onPlaceClick}>
            {item.placeName}
          </Text>
          }
        </Text>
      </View>
    );
  }
}

export default uncontrollable(
	PlantingListItem,
	{isHovered: 'onHoverChange'}
)
