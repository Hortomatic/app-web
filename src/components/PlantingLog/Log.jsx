import React, {Component, PropTypes} from 'react'
import View, {Cover, Row, Col, ScrollView, Text} from 'components/View'
import {StyleSheet} from 'react-native-web'
import _ from 'lodash'
import moment from 'moment'
import momentRange from 'moment-range'

import Header from './Header'
import LogEvent from './Event'
import AddButton from './AddButton'
import {eventComponents, lifecycleEventNames, actionEventNames} from './EventTypes'
import {
  orderEventsByDate,
  getEarliestTimelineDate,
  getLatestTimelineDate
} from 'utils/plantings'
import {formatPlantingForLog} from 'utils/plantings'
import createGetStyle from 'utils/getStyle'

const defaultStyles = StyleSheet.create({
  container: {
    backgroundColor: '#78C76D',
    flexDirection: 'column'
  },
  header: {

  },
  timelineContainer: {
    overflowY: 'scroll',
    backgroundColor: '#78C76D',
    flexDirection: 'column',
  },
  yearBoundary: {
    flexShrink: 0
  },
  yearBoundaryLabel: {

  },
  month: {
    paddingTop: 0,
    paddingBottom: 0,
    flexShrink: 0,
    flexGrow: 0,
    alignItems: 'center'
  },
  emptyMonth: {
    backgroundColor: "#76C36B"
  },
  emptyMonthLabel: {
    marginLeft: 140,
    alignItems: 'center',
  },
  emptyMonthLabelText: {
    color: '#fff',
    fontSize: 14,
    opacity: .7,
    fontWeight: 300
  },
  solidTimelineSegmentContainer: {
    position: 'absolute',
    left: 68,
    height: '100%',
    justifyContent: 'center'
  },
  event: {
  }
})

const svgStyles = {
  baseLine: {
    stroke: '#FFF',
    strokeWidth: 5,
    strokeLinejoin: 'round'
  }
}
export default class Log extends Component {

  static propTypes = {
    l10n: PropTypes.func.isRequired,
    planting: PropTypes.object.isRequired,
    dateRange: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    monthEvents: PropTypes.object.isRequired,
    onAddEventIntent: PropTypes.func.isRequired,
    onEventEditIntent: PropTypes.func.isRequired,
    eventTypes: PropTypes.object,
    selectedEventIndex: PropTypes.number,
    styles: PropTypes.object
  };

  static defaultProps = {
    styles: defaultStyles
  };

  handleWindowKeyDown = (ev) => {
    ev.stopPropagation()
    console.dir(ev)
  };

  handleAddIntent = (ev) => {
    this.props.onAddEventIntent()
  };

  handleEdit = (eventIndex) => {
    this.props.onEventEditIntent(eventIndex)
  };

  render () {
    const {planting, dateRange, monthEvents, styles} = this.props
    const getStyle = createGetStyle({...defaultStyles, ...styles})
    return (
      <View style={getStyle('container')}>
        <Header
          plantingData={planting}
          showAddButton={true}
          onAddIntent={this.handleAddIntent}
          styles={getStyle('header')}
          l10n={this.props.l10n}
        />
        <ScrollView style={getStyle('timelineContainer')}>
          {this.renderItems(getStyle)}
          <View style={{flexGrow:1}}></View>
        </ScrollView>
      </View>
    )
  }

    /**
   * Render list of events, grouped by month.
   * @return {array} Array of ReactElements
   */
  renderItems (getStyle) {
    const {dateRange, monthEvents, styles} = this.props

    let renderedMonths = []
    let previousMonthWasEmpty = true
    let consecutiveEmptyMonths = 0
    let monthNo = 0

    var range

    if (!dateRange) {
      let dates = _.keys(monthEvents)
      dates.sort()
      range = moment.range(dates[0], dates[dates.length-1])
    }
    else {
      range = (dateRange instanceof moment.range)
        ? dateRange
        : moment.range(dateRange[0], dateRange[1])
    }

    range.by('months', moment => {
      const thisMonthEvents = monthEvents[moment.format('YYYY MM')]
      const isEmpty = !thisMonthEvents

      if(isEmpty){
        consecutiveEmptyMonths++
        return;
      }
      // output a year boundary if needed
      if(moment.get('month')===0){
        renderedMonths.push(<Row style={getStyle('yearBoundary')}>
          <View style={getStyle('yearBoundaryLabel')}>{moment.format('YYYY')}</View>
        </Row>)
      }
      // this month has events, so dump an empty placeholder for previous empty months
      if(consecutiveEmptyMonths > 0){
          renderedMonths.push(
          <Row style={{...getStyle('month'), ...getStyle('emptyMonth'), height:80}} key={moment.format('YYYY-MM')}>
            <View style={getStyle('solidTimelineSegmentContainer')}>
              <svg width="45" height="80">
                <line x1="22" y1="0" x2="22" y2="27" style={svgStyles.baseLine}/>
                <line x1="22" y1="58" x2="22" y2="80" style={svgStyles.baseLine}/>
                <path d="M17.5,32 L17.5,27.4727695 L3,20.2278646 L31.5,12.580465 L17.5,5.33556008 L17.5,0.5"
                  style={svgStyles.baseLine}
                  transform="translate(4.5,26)"
                  fill="none"
                />
              </svg>
            </View>
            <Row style={getStyle('emptyMonthLabel')}>
              <Text style={getStyle('emptyMonthLabelText')}>No activity for {consecutiveEmptyMonths} months</Text>
            </Row>
          </Row>)
      }

      renderedMonths.push(
        <Row style={getStyle('month')}/*key={moment.format('YYYY-MM')}*/>
          <View style={getStyle('solidTimelineSegmentContainer')}>
            <svg width="45" height="100%">
              <line x1="22" y1="0" x2="22" y2="100%" style={svgStyles.baseLine} />
            </svg>
          </View>
          {/*<TransitionGroup
          component="View"
          transitionName="Plantings-animateTimeline"
          ref="timelineContent">*/}
          {this.renderMonthEvents( getStyle, thisMonthEvents, monthNo )}
          {/*</TransitionGroup>*/}
        </Row>
      )


      monthNo++;
    });

    renderedMonths.reverse();

    //add a final month on the end to pad the timeline out to
    //full height
    renderedMonths.push(<Row key="fillerMonth">
      <View style={{...getStyle('solidTimelineSegmentContainer')}}>
        <svg width="30" style={{flex:1}}>
          <line x1="22" y1="0" x2="22" y2="100%" style={svgStyles.baseLine} />
        </svg>
      </View>
    </Row>);

    return renderedMonths;
  }

  renderMonthEvents (getStyle, monthEvents, monthNo) {
    const {selectedEventIndex, planting} = this.props
    return (
      <Col>
        {monthEvents
          .map( (eventData, i)=>{
            //note: events have been grouped by month... i!=eventData index in month group, not original timeline
            return (
              <LogEvent
                eventData={eventData}
                isSelected={selectedEventIndex===eventData.indexInTimeline}
                //showActions={true || this.$get('showActions')}
                onEditIntent={()=>this.handleEdit(eventData.indexInTimeline)}
                //onTrash={()=>this.getActions('planting').trashEvent.push([eventData.indexInTimeline])}
                key={eventData.indexInTimeline} />
                )
          })
        .reverse()}
      </Col>
    )
  }


}
