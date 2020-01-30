import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import scale from 'd3-scale'

import Background from './Background'
import Grid from './Grid'
import Plantings from './Plantings'

//export Grid from './Grid'


const defaultStyles = {
  svg: {
    userSelect: 'none',
    WebkitUserSelect: 'none'
  }
}

export default class Plotter extends React.Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    plantings: PropTypes.array.isRequired,
    resolution: PropTypes.number,
    snap: PropTypes.bool
  };

  static defaultProps = {
    width: 0,
    height: 0,
    resolution: 16,
    snap: true
  };

  state = {
    plantings: this.props.plantings,
    current: undefined, // current planting
    zoom: 1,
    grid: true,
    resolution: this.props.resolution,
    snap: this.props.snap,
    history: [],
    cursor: undefined,
    isTranslating: false,
    isScaling: false,
    isRotating: false,
    transformParams: {},
    transformStart: {},
    altDown: false,
    shiftDown: false
  };

  svgElement = undefined;

  componentWillMount () {
    this.setState({
      plantings: this.orderZIndex(this.props.plantings)
    })
  }

  componentWillReceiveProps (props) {
    console.log('receiving props', props);
  }

  orderZIndex = (plantings) => {
    return plantings
      .sort((a, b) => a.zIndex < b.zIndex ? -1 : 1)
      .map((p, i) => Object.assign(p, { zIndex: i }))
  };

  deselectAll = () => this.setState({
    selected: false,
    current: undefined,
    isTranslating: false,
    isScaling: false,
    isRotating: false,
    transformStart: {},
    transformParams: {}
  });

  stopAllTransforms = () => this.setState({
    isTranslating: false,
    isScaling: false,
    isRotating: false,
    transformStart: {},
    transformParams: {}
  });

  setCurrent = (planting) => {
    let plantings = this.state.plantings.map((p, i) => (
      planting.id === p.id
        ? Object.assign({}, p, {zIndex:this.state.plantings.length+2})
        : p
    ))

    this.setState({
      current: Object.assign({}, planting),
      plantings: this.orderZIndex(plantings)
    })
  };

  setZoom = zoom => this.setState({zoom: zoom});

  setCurrentPosition = (x, y) => this.updateCurrent({x, y});

  updateCurrent = (change) => {
    let planting = this.state.plantings.find(p => p.id === this.state.current.id)
    let changed = Object.assign({}, planting, change)

    return {
      plantings: this.state.plantings.map(p => p.id===this.state.current.id ? changed : p),
      current: planting
    }
  };

  setCursor = cursor => {
    this.setState({cursor})
  };

  getSVG = () => this.svgElement;

  setSVGRef = (e) => {
    if (e) {
      this.svgElement = e
    }
  };

  handleBackgroundMouseUp = (e) => {
    this.deselectAll()
  };
  handleBackgroundMouseDown = (e) => {
    this.deselectAll()
  };

  render () {
    let {width, height} = this.props

    // console.log(this.state)

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full"
        style={defaultStyles.svg}
        ref={this.setSVGRef}>
        <Background
          onMouseDown={this.handleBackgroundMouseDown}
          onMouseUp={this.handleBackgroundMouseUp}
          {...{width, height}}/>
        <Grid {...{width, height, resolution: this.state.resolution}} />
        <Plantings
          width={width}
          height={height}

          getSVG={this.getSVG}
          setState={(state) => this.setState(state)}
          setCurrent={this.setCurrent}
          deselectAll={this.deselectAll}
          stopAllTransforms={this.stopAllTransforms}
          updateCurrent={this.updateCurrent}
          setCurrentPosition={this.setCurrentPosition}
          setCursor={this.setCursor}

          plantings={this.state.plantings}
          current={this.state.current}
          snap={this.state.snap}
          resolution={this.state.resolution}
          isTranslating={this.state.isTranslating}
          isScaling={this.state.isScaling}
          isRotating={this.state.isRotating}
          transformStart={this.state.transformStart}
          transformParams={this.state.transformParams}
          altDown={this.state.altDown}
          shiftDown={this.state.shiftDown}
        />
      </svg>
    )
  }

}
