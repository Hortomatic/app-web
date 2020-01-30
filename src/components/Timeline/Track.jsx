import React, {Component, PropTypes} from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import scale from 'd3-scale'

import Line from './Line'
import Marker from './Marker'
import Period from './Period'

const defaultStyles = {
  all: {
    stroke: '#6bc25f',
    fill: '#6bc25f'
  },
  container: {
    fill: 'transparent'
  },
  background: {
    fill: 'transparent',
    stroke: 'none',
    cursor: 'pointer'
  },
  inner: {

  },
  outer: {

  },
  hovered: {
    background: {
      // fill: 'rgba(255,255,255,.3)'
    }
  },
  selected: {
    background: {
      fill: '#ffffff'
    }
  }
}

export default class Track extends Component {
  static propTypes = {
    plotX: React.PropTypes.func.isRequired,
    yPos: PropTypes.number.isRequired,
    drawFrom: PropTypes.instanceOf(Date).isRequired,
    drawTo: PropTypes.instanceOf(Date).isRequired,
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
    styles: PropTypes.object,
    height: PropTypes.number,
    trackGroupIndex: PropTypes.number,
    trackIndex: PropTypes.number,
    isHovered: PropTypes.bool,
    isSelected: PropTypes.bool
  };

  static defaultProps = {
      styles: defaultStyles
  };

  onMouseEnter = () => {
    this.props.actions.hoverTrack(this.props.trackGroupIndex, this.props.trackIndex)
  };

  onClick = () => {
    this.props.isSelected
      ? this.props.actions.deselectTrack(this.props.trackGroupIndex, this.props.trackIndex)
      : this.props.actions.selectTrack(this.props.trackGroupIndex, this.props.trackIndex)
  };


  startMarkerMove = (group, track, marker, e) => {
    this.props.actions.startMarkerMove(group, track, marker, e)
  };

  editMarker = (group, track, marker, e) => {
    this.props.actions.editMarker(group, track, marker, e)
  };

  getSharedChildProps () {
    const { children, isEditing, plotX, height, trackGroupIndex, trackIndex } = this.props
    return {
      isEditing,
      plotX,
      yPos: height/2
    }
  }

  render () {
    const {
      children,
      actions,
      isEditing,
      trackGroupIndex,
      trackIndex,
      plotX,
      yPos,
      from,
      to,
      height,
      styles,
      isHovered,
      isSelected
    } = this.props

    const newChildren = this.props.assistedRender ? this.copyChildren() : this.renderChildren()
    const numChildren = React.Children.count(newChildren)
    const style = {
      ...defaultStyles.all,
      ...styles.all,
    }
    const backgroundStyle = {
      ...defaultStyles.background,
      ...styles.background,
      ...(isHovered ? defaultStyles.hovered.background : {}),
      ...(isSelected ? defaultStyles.selected.background : {})
    }
    return (
      <g
        style={style}
        onMouseEnter={this.onMouseEnter}
        onClick={this.onClick}
        transform={`translate(0, ${yPos})`}>
        <rect style={backgroundStyle} x={plotX(this.props.drawFrom)} width={plotX(this.props.drawTo)} height={height} />
        <g
          style={{...defaultStyles.inner, ...styles.inner}}>
          {newChildren}
        </g>
      </g>
    )
  }

  renderChildren () {
    const { periods, lines, markers, trackGroupIndex, trackIndex, plotX, height, isEditing } = this.props

    const {yPos, ...sharedProps} = this.getSharedChildProps()

    let renderedPeriods = periods.map( ({from, to}, i) => (
      <Period from={from} to={to} key={`period-${i}`} yPos={yPos} {...sharedProps} />) )
    let renderedLines = lines.map( ({from, to, appearance}, i) => (
      <Line from={from} to={to} appearance={appearance} yPos={yPos} {...sharedProps} />) )
    let renderedMarkers = markers.map( (marker, index) => (
      <Marker
        date={marker.date}
        icon={marker.icon}
        key={`marker-${index}`}
        appearance={marker.appearance}
        onMouseDown={e => isEditing && this.startMarkerMove(trackGroupIndex, trackIndex, index, marker, e)}
        onClick={e => isEditing || this.editMarker(trackGroupIndex, trackIndex, index, marker, e)}
        yPos={yPos}
        {...sharedProps} />
    ) )

    return [].concat(renderedPeriods, renderedLines, renderedMarkers)
  }

  copyChildren () {
    const { children, isEditing, plotX, height, trackGroupIndex, trackIndex } = this.props

    const newChildren = React.Children.map(children, (child, index) => {
      if(!child || !child.type)
        return child;

      let sharedProps = this.getSharedChildProps()
      if (child.type === Marker) {
        sharedProps.onMouseDown = e => this.startMarkerMove(trackGroupIndex, trackIndex, index, e)
      }

      return React.cloneElement(child, this.getSharedChildProps());
    }, this);
  }
}
