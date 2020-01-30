import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure'
import moment from 'moment'
import _ from 'lodash'

import {Cover} from 'components/View'

import { actions as calendarActions, selector } from '../../redux/modules/journal'
import { actions as plantingsActions } from '../../redux/modules/plantings'

export class CalendarView extends React.Component {
  static propTypes = {
    // counter: React.PropTypes.number.isRequired,
    // doubleAsync: React.PropTypes.func.isRequired,
    // increment: React.PropTypes.func.isRequired
    timelineData: React.PropTypes.array
  };

  state = {
    dimensions: {},
    isMounted: false
  };

  render () {
    const {plantings, plants, places} = this.props
    const {width, height} = this.state.dimensions


    return (
      <Measure
        onMeasure={(dimensions, mutations, target) => {
          console.log('Dimensions: ', dimensions)
          this.setState({dimensions})
        }}>
        <Cover style={{visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
          ...
        </Cover>
      </Measure>
    )
  }
}

export default connect(selector, {...calendarActions, ...plantingsActions})(CalendarView)

const styles = StyleSheet.create({
})
