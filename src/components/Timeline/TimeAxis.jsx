import React, {Component, PropTypes} from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import moment from 'moment'

const defaultStyles = {
  labels: {
    fontSize: 12,
    fontFamily: 'Museo Sans',
    textAnchor: "middle"
  },
  lines: {
  	strokeWidth: 1,
  	stroke: '#fff'
  }
}

export default class TimeAxis extends Component {
  static propTypes = {
    styles: PropTypes.object,
    showSeasons: PropTypes.bool,
    showMonths: PropTypes.bool,
    showWeeks: PropTypes.bool,
    showDays: PropTypes.bool
  };

  static defaultProps = {
    styles: defaultStyles,
    topGutterHeight: 20,
    showSeasons: false,
    showMonths: false,
    showWeeks: false,
    showDays: false
  };

  componentDidMount () {
   // var width = this.refs.svg.offsetWidth;
  }

  getTickWidth (plotX, xPos, ticks, i) {
    return i === ticks.length-1
      ? xPos - plotX(ticks[i-1])
      : plotX(ticks[i+1]) - xPos
  }

  formatSeason = (date) => {
    let month = date.getMonth()
    return (
      month < 1
        ? 'Winter'
        : month < 4
          ? 'Spring'
          : month < 7
            ? 'Summer'
            : 'Autumn'
    )
  };

  render () {
    const {
      dayWidth, ticks, yearTicks, seasonTicks, monthTicks, weekTicks, dayTicks,
      plotX, format, topGutterHeight, styles
    } = this.props
    const textYPos = 15

    // TODO: height should be calculated and passed down from parent compenent
    const height = 9999



    let yearWidth = dayWidth * 365
    const years = yearTicks.map( (date, i) => {
      const xPos = plotX(date)
      return (
        <g key={`year-${date}`}>
          <line x1={xPos} x2={xPos} y1={topGutterHeight} y2={height} style={{...defaultStyles.lines, ...styles.lines}} />
          <text x={xPos} y={textYPos} style={{...defaultStyles.labels, ...styles.labels}}>{format(date, '%Y')}</text>
        </g>
      )
    })

    let seasonWidth = dayWidth * 91.25
    const seasons = () => seasonTicks.map( (date, i) => {
      const xPos = plotX(date)
      return (
        <g key={`season-${date}`}>
          <line x1={xPos} x2={xPos} y1={topGutterHeight} y2={height} style={{...defaultStyles.lines, ...styles.lines}} />
          <text x={xPos+seasonWidth/2} y={textYPos} style={{...defaultStyles.labels, ...styles.labels}}>{this.formatSeason(date)}</text>
        </g>
      )
    })

    const months = () => monthTicks.map( (date, i) => {
      const xPos = plotX(date)
      const width = dayWidth * moment(date).daysInMonth()
      return (
        <g key={`month-${date}`}>
          <line x1={xPos} x2={xPos} y1={topGutterHeight} y2={height} style={{...defaultStyles.lines, ...styles.lines}} />
          <text x={xPos+width/2} y={textYPos} style={{...defaultStyles.labels, ...styles.labels}}>{moment(date).format('MMM')}</text>
        </g>
      )
    })

    let weekWidth = dayWidth*7
    const weeks = () => weekTicks.map( (date, i) => {
      const xPos = plotX(date)
      return (
        <g key={`week-${date}`}>
          <line x1={xPos} x2={xPos} y1={topGutterHeight} y2={height} style={{...defaultStyles.lines, ...styles.lines}} />
        </g>
      )
    })

    const days = () => dayTicks.map( (date, i) => {
      const xPos = plotX(date)
      return (
        <g key={`day-${date}`}>
          <line x1={xPos} x2={xPos} y1={topGutterHeight} y2={height} style={{...defaultStyles.lines, ...styles.lines}} />
          <text x={xPos+dayWidth/2} y={textYPos} style={{...defaultStyles.labels, ...styles.labels}}>{date.getDate()}</text>
        </g>
      )
    })

    return (
      <g>
        {years}
        {this.props.showSeasons && <g>{seasons()}</g>}
        {this.props.showMonths && <g>{months()}</g>}
        {this.props.showWeeks && <g>{weeks()}</g>}
        {this.props.showDays && <g>{days()}</g>}
      </g>
    )
  }
}
