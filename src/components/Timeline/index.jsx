import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import TransitionGroup from 'react-addons-css-transition-group'
// @FIXME for some reason import d3time ends up undefined but require works ok
// import d3time from 'd3-time'
const d3time = require('d3-time')
import scale from 'd3-scale'
import _ from 'lodash'
import moment from 'moment'
import momentRange from 'moment-range' //available as moment.range

import {earliest, latest} from 'utils/reduce'

import TrackGroup from './TrackGroup'
import Track from './Track'
import Line from './Line'
import Marker from './Marker'
import Period from './Period'
import TimeAxis from './TimeAxis'

export TrackGroup from './TrackGroup'
export Track from './Track'
export Line from './Line'
export Marker from './Marker'
export Period from './Period'
export TimeAxis from './TimeAxis'


const defaultStyles = {
  svg: {
    overflow:'visible',
    userSelect:'none',
    WebkitUserSelect: 'none',
    flex: 1
  },
  backdrop: {
    fill: '#F5F4E9'
  }
}

const PERIOD = 'period'
const MARKER = 'marker'

let debouncedMouseMoveLogger = _.debounce((ev) => console.log(ev), 50)

export default class Timeline extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
    topGutterHeight: PropTypes.number,
    onMarkerChange: PropTypes.func,
    onMarkerEditIntent: PropTypes.func,
    onDateRangeChange: PropTypes.func,
    styles: PropTypes.object
  };

  static defaultProps = {
    width: 0,
    height: 0,
    trackHeight: 50,
    styles: defaultStyles,
    topGutterHeight: 20
  };

  // todo: move state to 'uncontrollable' component props
  state = {
    isEditing: false,
    hoveredTrackIndex: [undefined, undefined],
    selectedTrackIndex: [undefined, undefined],
  };

  _startingDaysVisible = 250;

  _numDays = undefined;
  _stringData = undefined;
  _scale = 1;
  _doUpdate = false;

  componentWillMount(){
    // console.log(this.getDataDateBoundaries(), [this.props.from.getTime(), this.props.to.getTime()])
    this.updateCache(this.props);
    this.generateScale([this.props.from.getTime(), this.props.to.getTime()])
  }

  componentWillReceiveProps (nextProps) {
    // console.log('Receiving props', nextProps)

    // Invalidate cached scale and computed values when neccessary
    if (!this._updating) {
      // If the timeline is being scrolled, translate the DOM node directly
      // this is many orders of magnitude faser in FF than rendering a new value
      // to the translate attribute
      let el = ReactDOM.findDOMNode(this._scrollElement)
      // Apply transform translate to keep view consistent while re-drawing
      // off-screen elements
      let xPos = -this._scale(nextProps.from.getTime())
      el.setAttribute('transform', `translate(${xPos})`)
      //console.log('Manually set translate', xPos, this._zoomScale)
      console.log( -this._scale(nextProps.from.getTime()), xPos)

      console.log('Dates', moment(nextProps.from).format('YYYY.MM.DD'), moment(nextProps.to).format('YYYY.MM.DD'))
    } else {
      let el = ReactDOM.findDOMNode(this._scrollElement)
      el.setAttribute('transform', `translate(0)`)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const nextNumDays = moment.duration(moment.range(nextProps.from, nextProps.to).valueOf()).asDays()
    const shouldUpdate = (
      // data changed
      this._stringData !== JSON.stringify(nextProps.data)
      // view scale change
      || this._numDays !== nextNumDays
      // parent container size change
      || this.props.width !== nextProps.width
      || this.props.height !== nextProps.height
      // scroll nav is at bounds of what has been drawn to screen
      || this.isTimeToRedraw(nextProps)
    )
    if (shouldUpdate) {
      this._updating = true
    }
    return shouldUpdate
  }

  componentWillUpdate (nextProps) {

      this.updateCache(nextProps)
      this.generateScale([
        nextProps.from.getTime(),
        nextProps.to.getTime()
      ])
    // }
  }

  componentDidUpdate () {
    this._updating = false
    let el = ReactDOM.findDOMNode(this._scrollElement)
    el.setAttribute('transform', `translate(0)`)

    // let el = ReactDOM.findDOMNode(this._scrollElement)
    // Apply transform translate to keep view consistent while re-drawing
    // off-screen elements
    // let xPos = this.getScale()(this.props.from.getTime())
    // el.setAttribute('transform', `translate(${xPos})`)
    // console.log('Group offset', xPos)
  }

  isTimeToRedraw (props) {
    // check if the view is scrolled to it's limits
    return (
      this._scale(props.from.getTime()) < -props.width * this._zoomScale
      || this._scale(props.to.getTime()) > props.width * 2 * this._zoomScale
    )
  }

  updateCache (props) {
    this._numDays = moment.duration(moment.range(props.from, props.to).valueOf()).asDays()
    this._zoomScale = 1 //Math.max(1, this._startingDaysVisible / this._numDays)
    this._stringData = JSON.stringify(props.data)
    this._from = props.from
    this._to = props.to

    console.info('Update cache', {numDays: this._numDays, zoomScale: this._zoomScale})
  }

  getDrawDates () {
    const numDays = moment.duration(moment.range(this.props.from, this.props.to).valueOf()).asDays()

    return [
      this._scale(),
      this._Scale()
    ]
  }

  getDataDateBoundaries () {
    let earliestDate = this.props.data.map(
      g => g.tracks.map(t => t.from).reduce(earliest)
    ).reduce(earliest)
    let latestDate = this.props.data.map(
      g => g.tracks.map(t => t.to).reduce(latest)
    ).reduce(latest)
    let earliestTimestamp = moment(earliestDate).startOf('month').toDate().getTime()
    let latestTimestamp = moment(latestDate).endOf('month').toDate().getTime()

    return [earliestTimestamp, latestTimestamp]
  }

  generateScale (dateBounds) {
    //console.warn('Recalculating view scale!', dateBounds, dateBounds.map(t => new Date(t)))
    const {width} = this.props
    const numDays = moment.duration(moment.range(dateBounds[0], dateBounds[1]).valueOf()).asDays()
    const domain = [
      moment(dateBounds[0]).subtract(numDays, 'days').toDate().getTime(),
      moment(dateBounds[1]).add(numDays, 'days').toDate().getTime()
    ]
    const range = [
      width * -1 * this._zoomScale,
      width * 2 * this._zoomScale
    ]
    console.warn('Computed view scale!', domain, range)

    this._scale = scale.scaleTime()
      .domain(domain)
      .range(range)
      // .nice()
    const day = moment(dateBounds[0]).startOf(day)
    this._dayWidth = this._scale(moment(day).add(1, 'day').toDate().getTime()) - this._scale(day.toDate().getTime())
  }

  hoverTrack = (groupIndex, trackIndex) => {
    this.setState({
      hoveredTrackIndex: [groupIndex, trackIndex]
    })
  };

  selectTrack = (groupIndex, trackIndex) => {
    this.setState({
      selectedTrackIndex: [groupIndex, trackIndex]
    })
  };

  deselectTrack = (groupIndex, trackIndex) => {
    this.setState({
      selectedTrackIndex: [undefined, undefined]
    })
  };

  startMarkerMove = (groupIndex, trackIndex, markerIndex, marker, e) => {
    this.setState({
      isDragging: true,
      dragObject: MARKER,
      dragParams: {groupIndex, trackIndex, markerIndex, marker}
    })
  };

  setMarkerDate = (groupIndex, trackIndex, markerIndex, marker, date) => {
    // console.log(groupIndex, trackIndex, markerIndex, date)
    this.props.onMarkerChange(groupIndex, trackIndex, markerIndex, Object.assign({}, marker, {date: new Date(date)}))
  };

  setPeriodDates = (track, period, dates) => {

  };

  getSVGElement = () => ReactDOM.findDOMNode(this.refs.svg);

  // return an SVG point with the given X, Y coords
  makePoint = (x=0, y=0) => {
    this.point = this.point || this.getSVGElement().createSVGPoint()
    this.point.x = x
    this.point.y = y
    return this.point
  };

  handleMouseMove = (e) => {
    if (this.state.isDragging) {
      let svgEl = this.getSVGElement()
      let mouseP = this.makePoint(e.clientX, e.clientY)
      let mouseToCanvasTM = svgEl.getScreenCTM().inverse().multiply(svgEl.getCTM())
      // let canvasToCurrentTM = currentEl.getCTM().inverse().multiply(mouseToCanvasTM)
      let mouseCanvasP = mouseP.matrixTransform(mouseToCanvasTM)
      // let mouseCurrentP = mouseP.matrixTransform(canvasToCurrentTM)
      //
      const scale = this.getScale()
      const date = scale.invert(mouseCanvasP.x)
      const {groupIndex, trackIndex, markerIndex, marker} = this.state.dragParams

      switch (this.state.dragObject) {
        case MARKER:
          this.setMarkerDate(groupIndex, trackIndex, markerIndex, marker, date)
        break;
      }
    }
    // debouncedMouseMoveLogger(date)
  };

  handleMouseUp = (e) => {
    this.setState({
      isDragging: false,
      dragObject: undefined,
      dragParams: undefined
    })
  };

  handleMouseWheel = (e) => {
    e.preventDefault()
    if (e.deltaX !== 0) {
      // console.log(e.deltaX)
      const {from, to} = this.props
      const scale = this.getScale()
      const fromPos = scale(from.getTime())
      const toPos = scale(to.getTime())
      let fromDate = scale.invert(fromPos + e.deltaX)
      let toDate = scale.invert(toPos + e.deltaX)

      this.props.onDateRangeChange(fromDate, toDate)
    }
  };

  editMarker = (groupIndex, trackIndex, markerIndex, marker) => {
    this.props.onMarkerEditIntent(groupIndex, trackIndex, markerIndex, marker)
  };

  getScale = () => {
    return this._scale
  };

  getChildProps = () => {
    const {from, to, trackHeight, styles, topGutterHeight} = this.props

  };

  render () {
    if (this.props.data) {
      return this.controlledRender( this.props )
    }else{
      return this.assistedRender( this.props )
    }
  }

  controlledRender (props) {
    console.warn('Rendering!')
    const {data, width, height, from, to, trackHeight, styles, topGutterHeight} = props
    const {hoveredTrackIndex, selectedTrackIndex} = this.state

    const showDays = this._numDays < 14
    const showWeeks = this._numDays < 151 && this._numDays > 15
    const showMonths = this._numDays > 150 && this._numDays < 365
    const showSeasons = this._numDays > 364 && this._numDays < 650

    const viewScale = this.getScale()

    const timeAxisTicks = viewScale.ticks()
    const yearTicks = viewScale.ticks(d3time.timeYear, 1)
    const seasonTicks = showSeasons && viewScale.ticks(d3time.timeMonth, 3)
    const monthTicks = showMonths && viewScale.ticks(d3time.timeMonth, 1)
    const weekTicks = showWeeks && viewScale.ticks(d3time.timeWeek, 1)
    const dayTicks = showDays && viewScale.ticks(d3time.timeDay, 1)
    const plotX = date => viewScale(date.getTime())
    const formatDate = viewScale.tickFormat()
    var cumulativeY = topGutterHeight
    const plotY = numChildren => {
      let y = cumulativeY
      cumulativeY += trackHeight * numChildren
      return y
    }
    let totalHeight = data.reduce((totalHeight, {tracks}) => {
      return totalHeight + tracks.length*trackHeight
    }, topGutterHeight)


    const sharedProps = {
      actions: {
        startMarkerMove: this.startMarkerMove,
        setMarkerDate: this.setMarkerDate,
        setPeriodDates: this.setPeriodDates,
        editMarker: this.editMarker,
        hoverTrack: this.hoverTrack,
        selectTrack: this.selectTrack,
        deselectTrack: this.deselectTrack
      },
      dayWidth: this._dayWidth,
      plotX,
      plotY,
      format: formatDate,
      trackHeight,
      ticks: timeAxisTicks,
      yearTicks,
      seasonTicks,
      monthTicks,
      weekTicks,
      dayTicks,
      isEditing: this.state.isEditing,
      hoveredTrackIndex: this.state.hoveredTrackIndex,
      selectedTrackIndex: this.state.selectedTrackIndex
    }
    const svgStyles = {
      ...defaultStyles.svg,
      width,
      minHeight: height,
      height: totalHeight,
      ...styles.svg
    }

    // initial value for translation, this attribute will be updated by
    // lifecycle hooks for performance
    let translateX = 0//plotX(from) - width
    let translateY = 0

    return (
      <svg
        style={svgStyles}
        ref="svg"
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onWheel={this.handleMouseWheel}
      >
        <rect x={0} y={0} width="100%" height="100%" style={{...defaultStyles.backdrop, ...styles.backdrop}} />
        <g ref={e => {if(e) this._scrollElement = e}} transform={`translate(${translateX})`}>
          {this.props.debug &&
            <rect x={plotX(from)} y={0} width={plotX(to)} height={height} style={{fill: 'none', stroke:'red', strokeWidth:2}} />
          }
          <TimeAxis
            showDays={showDays}
            showWeeks={showWeeks}
            showMonths={showMonths}
            showSeasons={showSeasons}
            {...sharedProps}
          />
          {data.map( ({name, tracks}, groupIndex) => (
            <TrackGroup
              key={groupIndex}
              drawFrom={this.props.from}
              drawTo={this.props.to}
              drawBoundary={[
                this.props.width * -1 * this._zoomScale,
                this.props.width * 2 * this._zoomScale
              ]}
              from={tracks.map( ({from}) => from ).reduce(earliest)}
              to={tracks.map( ({to}) => to ).reduce(latest)}
              tracks={tracks}
              isHovered={hoveredTrackIndex[0]===groupIndex}
              isSelected={selectedTrackIndex[0]===groupIndex}
              isEven={groupIndex%2}
              trackGroupIndex={groupIndex}
              {...sharedProps} />
          ))}
        </g>
      </svg>
    )
  }

  // assistedRender (props) {
  //   throw Error('Assisted render is borked')
  //
  //   const {children, from, to, trackHeight, styles, topGutterHeight} = props
  //   const viewScale = this.getScale()
  //   const timeAxisTicks = viewScale.ticks()
  //   const plotX = date => viewScale(date.getTime())
  //   const formatDate = viewScale.tickFormat()
  //   var cumulativeY = topGutterHeight
  //   const plotY = numChildren => {
  //     let y = cumulativeY
  //     cumulativeY += trackHeight * numChildren
  //     return y
  //   }
  //
  //   const newChildren = React.Children.map(children, (child, index) => {
  //     if (child.type) {
  //       return React.cloneElement(child, {
  //         actions: {
  //           startMarkerMove: this.startMarkerMove,
  //           setMarkerDate: this.setMarkerDate,
  //           setPeriodDates: this.setPeriodDates,
  //           editMarker: this.editMarker
  //         },
  //         plotX,
  //         format: formatDate,
  //         plotY,
  //         trackHeight,
  //         ticks: timeAxisTicks,
  //         isEven: index%2,
  //         assistedRender: true,
  //         ...this.state
  //       });
  //     }
  //   }, this);
  //
  //   return (
  //     <svg style={{...defaultStyles.svg, ...styles.svg}} ref="svg" onMouseMove={this.handleMouseMove}>
  //       <rect x={0} y={0} width="100%" height="100%" style={{...defaultStyles.backdrop, ...styles.backdrop}} />
  //       {newChildren}
  //     </svg>
  //   )
  // }
}
