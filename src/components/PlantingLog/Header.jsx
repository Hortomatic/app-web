import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'
import {View, Row, Col, Text} from 'components/View'
import createGetStyle from 'utils/getStyle'
import {
  getPlantingName,
  getPlantingPlantName,
  getPlantingPlaceName,
  getPlaceIdFromTimeline
} from 'utils/plantings'

import AddButton from './AddButton'

const baseTextStyle = {
  color: '#FFF',
  fontWeight: '900'
}

const defaultStyles = StyleSheet.create({
  container: {
    backgroundColor: '#8ACE81',
    flexShrink: 0,
    flexGrow: 0
  },
  iconAndDetails: {
    paddingTop: 25,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 0
  },
  menuIcon: {
    width: 35,
    flexGrow: 0,
    flexShrink: 0
  },
  plantIcon: {
    backgroundColor: '#fff',
    width: 108,
    height: 108,
    borderRadius: 54,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textDetails: {
    justifyContent: 'center',
    paddingLeft: 20
  },
  plantingName: {
    ...baseTextStyle,
    fontSize: 24
  },
  plantName: {
    ...baseTextStyle,
    fontSize: 18
  },
  inPlace: {
    ...baseTextStyle,
    fontSize: 18,
    fontWeight: '500'
  },
  placeName: {
    ...baseTextStyle,
    fontSize: 18
  }
})

export default class LogHeader extends Component{
  static propTypes = {
    plantingData: PropTypes.object.isRequired,
    styles: PropTypes.object,
    onAddIntent: PropTypes.func.isRequired,
    l10n: PropTypes.func.isRequired
  };
  static defaultProps = {
    styles: {}
  };

  handleAddClick = (e) => {
    this.props.onAddIntent(e)
  };

  render () {
    const {styles, plantingData} = this.props
    const getStyle = createGetStyle({...defaultStyles, ...styles})
    return (
      <Col style={getStyle('container')}>
        <Row style={getStyle('iconAndDetails')}>
          <View style={getStyle('menuIcon')}></View>
          <View style={getStyle('plantIcon')}>icon</View>
          <Col style={getStyle('textDetails')}>
            <Row style={{alignItems: 'flex-end'}}>
              <Text style={getStyle('plantingName')}>{getPlantingName(plantingData)}</Text>
            </Row>
            <Row>
              <Row>
                <Text style={getStyle('plantName')}>{getPlantingPlantName(plantingData)}</Text>
              </Row>
              {getPlaceIdFromTimeline(plantingData) &&
                <Row>
                  <Text style={getStyle('inPlace')}> in </Text>
                  <Text style={getStyle('placeName')}>{getPlantingPlaceName(plantingData)}</Text>
                </Row>
              }
            </Row>
          </Col>
        </Row>
        <AddButton
          label={this.props.l10n('AddEventButton')}
          icon="add"
          keys={['cmd', '+']}
          onClick={this.handleAddClick}
        />
      </Col>
    )
  }
}
