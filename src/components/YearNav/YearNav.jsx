import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import scale from 'd3-scale'
// @FIXME for some reason import d3time ends up undefined but require works ok
// import d3time from 'd3-time'
const d3time = require('d3-time')
import moment from 'moment'

const RESIZEFACE_LEFT = 'LEFT'
const RESIZEFACE_RIGHT = 'RIGHT'

const defaultStyles = {
  monthDot: {
    fill: 'rgba(129,128,118,.25)'
  },
  yearLabel: {
    fontSize: 12,
    fontFamily: 'Museo Sans',
    fontWeight: 500,
    fill: '#818076',
    textAnchor: 'middle',
    dominantBaseline: 'central'
  },
  selectionBox: {
    fill: '#F9E499'
  },
  selectionDragHandle: {
    fill: 'rgba(255,255,255,0)',
    cursor: 'move'
  },
  selectionResizeRightHandle: {
    fill: 'rgba(255,255,255,0)',
    cursor: 'col-resize'
  },
  selectionResizeLeftHandle: {
    fill: 'rgba(255,255,255,0)',
    cursor: 'col-resize'
  }
}

export default class YearNav extends Component{
  static propTypes = {
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
    selectedFrom: PropTypes.instanceOf(Date).isRequired,
    selectedTo: PropTypes.instanceOf(Date).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    styles: PropTypes.object
  };

  static defaultProps = {
    width: 100,
    height: 10,
    styles: defaultStyles
  };

  state = {
    isDragging: false,
    isResizing: false
  };

  // merge props.styles over default props
  getStyles (name) {
    return {...defaultStyles[name], ...this.props.styles[name]}
  }

  getScale = () => {
    const {from, to, width} = this.props
    if(from !== this.cachedFrom && to !== this.cachedTo){
      this.cachedFrom = from
      this.cachedTo = to
      this.cachedScale = scale.scaleTime()
      .domain([from, to])
      .range([-100, width+100])
      // .nice()
    }
    return this.cachedScale
  };

  getSVGElement = () => ReactDOM.findDOMNode(this.refs.svgEl);

  // return an SVG point with the given X, Y coords
  makePoint = (x=0, y=0) => {
    this.point = this.point || this.getSVGElement().createSVGPoint()
    this.point.x = x
    this.point.y = y
    return this.point
  };

  getMouse = (e) => {
    let svgEl = this.getSVGElement()
    let mouseP = this.makePoint(e.clientX, e.clientY)
    let mouseToCanvasTM = svgEl.getScreenCTM().inverse().multiply(svgEl.getCTM())
    let mouseCanvasP = mouseP.matrixTransform(mouseToCanvasTM)
    return mouseCanvasP
  };

  handleSelectionMouseDown = (e) => {
    this.setState({
      isDragging: true,
      isResizing: false,
      mouseStart: this.getMouse(e)
    })
  };

  handleResizeMouseDown = (face, e) => {
    this.setState({
      isResizing: true,
      isDragging: false,
      mouseStart: this.getMouse(e),
      resizeFace: face
    })
  };

  handleMouseMove = (e) => {
    const {
      isDragging,
      isResizing,
      mouseStart
    } = this.state

    if (!isDragging && !isResizing) {
      return;
    }
    e.preventDefault()

    let mouse = this.getMouse(e)
    let delta = mouse.x - mouseStart.x
    const scale = this.getScale()
    const selectedFromPos = scale(this.props.selectedFrom)
    const selectedToPos = scale(this.props.selectedTo)
    let newSelectedToDate
    let newSelectedFromDate

    if (isDragging) {
      newSelectedFromDate = scale.invert(selectedFromPos - delta)
      newSelectedToDate = scale.invert(selectedToPos - delta)
    } else
    if (isResizing) {
      if (this.state.resizeFace === RESIZEFACE_LEFT) {
        delta = delta*-1
      }
      newSelectedFromDate = scale.invert(selectedFromPos - delta*2)
      newSelectedToDate = scale.invert(selectedToPos + delta*2)
    }


    // console.log(delta, newSelectedFromDate,newSelectedToDate)

    // TODO performance improvements by batching this into RaF
    // or move all state out into props to allow for performance tweaking
    // higher up

    if (newSelectedFromDate < newSelectedToDate) {
      this.props.onChange(newSelectedFromDate, newSelectedToDate)
    }
    this.setState({
      mouseStart: mouse
    })
  };

  handleMouseUp = (e) => {
    console.log('Mouseup!')
    this.setState({
      isDragging: false,
      isResizing: false
    })
  };

  handleMouseLeave = (e) => {
    console.log('Mouseleave!')
    this.setState({
      isDragging: false,
      isResizing: false
    })
  };


  render () {
    const {
      width,
      height,
      styles,
      from,
      to,
      selectedFrom,
      selectedTo
    } = this.props

    const viewScale = this.getScale()
    const plotX = date => viewScale(date)
    const ticks = viewScale.ticks(d3time.timeMonth, 1)
    const yPos = 20
    const radius = 4.5
    const resizeHandleRadius = 5

    const dots = ticks.map( (date, i) => {
      const xPos = plotX(moment(date).add(2, 'weeks').toDate())
      // const width = i === ticks.length-1
      //   ? xPos - plotX(ticks[i-1])
      //   : plotX(ticks[i+1]) - xPos
      return (
        <circle
          cx={xPos}
          cy={yPos}
          r={radius}
          style={this.getStyles('monthDot')}
          key={date.toString()}
        />
      )
    })

    const years = viewScale.ticks(d3time.timeYear, 1)
    .map( date => {
      const xPos = plotX(date)
      return (
        <text
          x={xPos}
          y={height/2}
          transform={`rotate(-90 ${xPos} ${height/2})`}
          style={this.getStyles('yearLabel')}
        >
          {date.getFullYear()}
        </text>
      )
    })

    return (
      <svg
        height={height}
        width={width}
        ref="svgEl"
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      >
        <rect
          x={plotX(selectedFrom)}
          y={0}
          width={plotX(selectedTo) - plotX(selectedFrom)}
          height={height}
          style={this.getStyles('selectionBox')}
          ref="selectionBg"
        />
        <g>{dots}</g>
        <g>{years}</g>
        <rect
          x={0}
          y={0}
          width={plotX(to)}
          height={height}
          style={this.getStyles('selectionDragHandle')}
          onMouseDown={this.handleSelectionMouseDown}
          ref="selectionDragHandle"
        />
        <rect
          x={plotX(selectedTo)-resizeHandleRadius}
          y={0}
          width={resizeHandleRadius*2}
          height={height}
          onMouseDown={e => this.handleResizeMouseDown(RESIZEFACE_RIGHT, e)}
          style={this.getStyles('selectionResizeRightHandle')}
          ref="selectionResizeRightHandle"
        />
        <rect
          x={plotX(selectedFrom)-resizeHandleRadius}
          y={0}
          width={resizeHandleRadius*2}
          height={height}
          onMouseDown={e => this.handleResizeMouseDown(RESIZEFACE_LEFT, e)}
          style={this.getStyles('selectionResizeLeftHandle')}
          ref="selectionResizeLeftHandle"
        />
      </svg>
    )
  }
}
