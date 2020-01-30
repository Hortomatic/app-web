import React, {Component, PropTypes} from 'react'
import TransitionGroup from 'react-addons-css-transition-group'

import Track from './Track'

const defaultStyles = {
  all: {

  },
  backdrop: {
    fill: 'transparent',
    strokeWidth: 0
  },
  backdropEven: {
    fill: 'rgba(255,255,255,0.4)',
  },
  backdropOdd: {
  },
  lines: {
    strokeWidth: 1,
    stroke: '#fff'
  }
}

export default class TrackGroup extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    plotX: PropTypes.func.isRequired,
    drawFrom: PropTypes.instanceOf(Date).isRequired,
    drawTo: PropTypes.instanceOf(Date).isRequired,
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
    plotY: PropTypes.func.isRequired,
    styles: PropTypes.object,
    trackHeight: PropTypes.number.isRequired,
    ticks: PropTypes.array,
    showTicks: PropTypes.bool,
    hoveredTrackIndex: PropTypes.array.isRequired,
    selectedTrackIndex: PropTypes.array.isRequired
  };

  static defaultProps = {
    styles: defaultStyles,
    showTicks: false
  };

  getSharedChildProps () {
    const {
      actions,
      assistedRender,
      isEditing,
      trackGroupIndex,
      plotX,
      plotY,
      from,
      to,
      trackHeight,
      styles,
      ticks,
      showTicks,
      isEven,
      isHovered,
      isSelected,
      ...childProps
    } = this.props

    return {
      actions,
      assistedRender,
      isEditing,
      plotX,
      from,
      to,
      height: trackHeight,
      trackGroupIndex,
      ...childProps
    }
  }

  render () {
    const {
      children,
      actions,
      isEditing,
      trackGroupIndex,
      plotX,
      plotY,
      drawFrom,
      drawTo,
      from,
      to,
      trackHeight,
      styles,
      ticks,
      showTicks,
      isEven,
      isHovered,
      isSelected,
      ...childProps
    } = this.props

    const newChildren = this.props.assistedRender ? this.copyChildren() : this.renderChildren()

    const numChildren = React.Children.count(newChildren)

    return (
      <g transform={`translate(0, ${plotY(numChildren)})`} style={{...defaultStyles.all, ...styles.all}}>
        <rect x={this.props.drawBoundary[0]} y={0} width={this.props.drawBoundary[1]-this.props.drawBoundary[0]} height={trackHeight * numChildren}
          style={{...defaultStyles.backdrop, ...styles.backdrop, ...defaultStyles[`backdrop${isEven?'Even':'Odd'}`], ...styles[`backdrop${isEven?'Even':'Odd'}`]}} />
        <g style={{...defaultStyles.lines, ...styles.lines}}>
          {showTicks && ticks
            .map( date => ({date, xPos:plotX(date)}) )
            .map( ({date, xPos}) => <line x1={xPos} x2={xPos} y1={0} y2={trackHeight * numChildren} />)
          }
        </g>
        {newChildren}
      </g>
      )
  }

  renderChildren () {
    const {
      tracks,
      trackHeight,
      styles,
      isHovered,
      isSelected,
      hoveredTrackIndex,
      selectedTrackIndex
    } = this.props

    const sharedProps = this.getSharedChildProps()

    return (
      tracks.map(({from, to, lines, periods, markers, styles}, trackIndex) => (
      <Track
        drawFrom={this.props.drawFrom}
        drawTo={this.props.drawTo}
        from={from}
        to={to}
        key={trackIndex}
        styles={styles || {}}
        yPos={trackHeight*trackIndex}
        trackIndex={trackIndex}
        lines={lines}
        periods={periods}
        markers={markers}
        isHovered={isHovered && hoveredTrackIndex[1]===trackIndex}
        isSelected={isSelected && selectedTrackIndex[1]===trackIndex}
        {...sharedProps}>
      </Track>)
    ))
  }

  copyChildren () {
    const { children, trackHeight } = this.props

    let sharedProps = this.getSharedChildProps()

    const newChildren = React.Children.map(children, (child, trackIndex) => {
      if(!child || !child.type)
        return child;

      let props = Object.assign(this.getSharedChildProps(), {
        yPos: trackHeight*trackIndex,
        isHovered: hoveredTrackIndex===trackIndex,
        isSelected: selectedTrackIndex===trackIndex
      })

      return React.cloneElement(child, props);
    }, this);
  }
}
