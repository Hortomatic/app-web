import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet} from 'react-native-web'
import _ from 'lodash'
import translate from 'counterpart'

import {Cover, Col, Row, Text} from 'components/View'
import PlantList from 'components/PlantList'
import PlantingLog from 'components/PlantingLog'

import {SAVING, SAVED, FAILED} from 'constants/status'
import {
  actions as plantingsActions
} from 'redux/modules/plantings'
import {
  actions,
  selector
} from 'redux/modules/addPlanting'

const STEP_PLANT = 1
const STEP_NAME = 2
const STEP_EVENTS = 3

import {getPlanting, getEventAtIndex} from 'utils/plantings'

const styles = StyleSheet.create({
  container: {

  },
  header: {

  },
  headerLeft: {

  },
  headerCenter: {

  },
  headerRight: {

  },
  headerTitle: {

  },
  headerCancelButton: {

  },
  headerNextButton: {

  }
})

export class AddPlanting extends Component{
  render () {
    return (
      <Cover style={styles.container}>
        {this.renderSteps()}
      </Cover>
    )
  }

  renderHeader () {
    return (
      <Row style={styles.header}>
        <Col style={styles.headerLeft}>
          <Button>Cancel</Button>
        </Col>
        <Col style={styles.headerCenter}>
          <Text style={styles.headerTitle}></Text>
        </Col>
        <Col style={styles.headerRight}>
          <Button>Next</Button>
        </Col>
      </Row>
    )
  }

  renderSteps () {
    const {styles, step} = this.props
    switch (step) {
      case STEP_PLANT:
      break;
      case STEP_NAME:
      break;
      case STEP_EVENTS:
      break;
    }
  }

  renderPlantStep () {
    //plant list with search
    //add plant button

    //add plant form
  }

  renderNameStep () {

  }

  renderEventsStep () {

  }
}

export default connect(selector, {
  ...plantingsActions,
  ...actions
})(AddPlanting)
