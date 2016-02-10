import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure'
import moment from 'moment'
import _ from 'lodash'

import {Cover, Col} from 'components/View'
import Timeline, {TimeAxis, TrackGroup, Track, Line, Period, Marker} from 'components/Timeline'
import YearNav from 'components/YearNav'
import {EditEvent} from 'components/PlantingEventForm'

import { actions as timelineActions, selector as timelineSelector } from '../../redux/modules/timeline'
import { actions as plantingsActions } from '../../redux/modules/plantings'

export class TimelineView extends React.Component {
  static propTypes = {
    // counter: React.PropTypes.number.isRequired,
    // doubleAsync: React.PropTypes.func.isRequired,
    // increment: React.PropTypes.func.isRequired
    timelineData: React.PropTypes.array
  };

  // TODO move state to redux
  state = {
    dimensions: {},
    isMounted: false
  };

  componentWillMount = () => {

  };

  componentDidMount = () => {
    setTimeout(() => this.setState({isMounted: true}), 20)
  };

  l10n = (key, data) => {
    return key
  };

  handleMarkerChange = (groupIndex, trackIndex, markerIndex, marker) => {
    // let data = this.state.data.slice()
    // data[groupIndex].tracks[trackIndex].markers[markerIndex] = marker
    // console.log('new data', data)
    // this.setState({
    //   data
    // })

    this.props.setPlantingEventDate({
      plantingId: this.props.timelineData[groupIndex].tracks[trackIndex].plantingId,
      eventIndex: marker.eventIndex,
      date: marker.date,
      dateType: 'actual'
    })

    // actions.go SET_PLANTING_EVENT_DATE
  };

  handleMarkerEditIntent = (groupIndex, trackIndex, markerIndex, marker) => {
    this.props.showEditEventForm({
      plantingId: this.props.timelineData[groupIndex].tracks[trackIndex].plantingId,
      eventIndex: marker.eventIndex
    })
  };

  handleEventDataChange = (eventData) => {
    this.props.setEventData(eventData)
  };

  handleSelectedDateRangeChange = (from, to) => {
    this.props.setDateRange({from, to})
  };

  render () {
    const {width, height} = this.state.dimensions
    const {viewState} = this.props

    // grab data from memoized selector
    let data = this.props.timelineData

    return (
      <Measure
        onMeasure={(dimensions, mutations, target) => {
        console.log('Dimensions: ', dimensions);
        this.setState({dimensions})
        }}>
        <Cover style={{visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
          {this.props.viewState.editEventForm.show &&
            <EditEvent
              onChange={this.handleEventDataChange}
              eventData={this.props.editEventFormData}
              l10n={this.l10n}
            />
          }
          {this.state.isMounted &&
            <Col>
              <div style={{overflowY: 'scroll', flexGrow:1, flexShrink:1}} >
                <Timeline
                  from={viewState.from}
                  to={viewState.to}
                  height={height}
                  width={width}
                  data={data}
                  onMarkerChange={this.handleMarkerChange}
                  onMarkerEditIntent={this.handleMarkerEditIntent}
                  onDateRangeChange={this.handleSelectedDateRangeChange}
                />
              </div>
              <div style={{flexGrow:0, flexShrink:0, flexBasis:40, overflowY:'hidden'}}>
                <YearNav
                  width={width}
                  height={40}
                  from={moment(viewState.from).subtract(400, 'days').toDate()}
                  to={moment(viewState.to).add(400, 'days').toDate()}
                  selectedFrom={viewState.from}
                  selectedTo={viewState.to}
                  onChange={this.handleSelectedDateRangeChange}
                />
              </div>
            </Col>
          }
        </Cover>
      </Measure>
    )
  }
}

export default connect(timelineSelector, {...timelineActions, ...plantingsActions})(TimelineView)

const styles = StyleSheet.create({
})
