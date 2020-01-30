import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import { StyleSheet } from 'react-native-web'

import Planting from './Planting'

import _ from 'lodash'

const defaultStyles = {

}

let debouncedMouseMoveLogger = _.debounce((ev) => console.log(ev), 200)

function angleBetweenPoints(p1, p2) {
    if (p1[0] == p2[0] && p1[1] == p2[1])
        return Math.PI / 2;
    else
        return Math.atan2(p2[1] - p1[1], p2[0] - p1[0] );
}

function distanceBetweenPoints(p1, p2) {
    return Math.sqrt( Math.pow( p2[1] - p1[1], 2 ) + Math.pow( p2[0] - p1[0], 2 ) );
}

function rotatePoint(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

export default class Plotter extends Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    getSVG: PropTypes.func.isRequired,
    plantings: PropTypes.array.isRequired,
    current: PropTypes.object,
    snap: PropTypes.bool.isRequired,
    resolution: PropTypes.number.isRequired,
    isTranslating: PropTypes.bool.isRequired,
    isScaling: PropTypes.bool.isRequired,
    isRotating: PropTypes.bool.isRequired,
    transformStart: PropTypes.object.isRequired,
    transformParams: PropTypes.object.isRequired,

    stopAllTransforms: PropTypes.func.isRequired,
    deselectAll: PropTypes.func.isRequired,
  };

  static defaultProps = {
    width: 0,
    height: 0
  };

  plantingInstances = {};

  componentDidMount () {
    // TODO: reuse listeners, or find a more reacty way of handling this to prevent multiple listeners
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }
  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  selectPlanting = (planting) => {
    this.props.setCurrent(planting)
  };

  handleMouseDown = (e) => {
    console.log('Mouse down')
    const { setState } = this.props
  };

  handleMouseUp = (planting, e) => {
    console.log('Mouse up: plantings')
    this.props.stopAllTransforms()
  };

  handleMouseLeave = (e) => {
    console.log('Mouse leave: plantings')
    this.props.stopAllTransforms()
  };

  handleMouseMove = (e) => {
    //requestAnimationFrame(time => this.batchedMouseMove(e))
    this.batchedMouseMove(e)
  };

  makePoint = (x, y) => {
    let point = this.props.getSVG().createSVGPoint()
    point.x = x
    point.y = y
    return point
  };

  batchedMouseMove = (e) => {

    const {
      plantings,
      current,
      isTranslating,
      isScaling,
      isRotating,
      transformStart,
      width,
      height,
      snap,
      zoom,
      padding,
      resolution,
      setState,
      updateCurrent,
      setCurrentPosition,
      shiftDown
    } = this.props
    const ev = e.nativeEvent

    // debouncedMouseMoveLogger(Object.assign({}, e))

    console.log('shiftdown', shiftDown)

    if (!current) {
      return
    }
    if (!isTranslating && !isScaling && !isRotating) {
      return
    }

    let svgElement = this.props.getSVG()
    let element = ReactDOM.findDOMNode(this.plantingInstances[current.id])

    // mouse point
    let mousePoint = this.makePoint(e.clientX, e.clientY)
    // Transform from window to <SVG> coordinate space
    let windowToCanvasTM = this.props.getSVG().getScreenCTM().inverse().multiply(svgElement.getCTM())
    //transform matrix: window coords to main <SVG> element coords
    let windowToElementTM = element.getCTM().inverse().multiply(windowToCanvasTM)
    // Transform from element to canvas coordinate space
    let elementToCanvasTM = element.getCTM().multiply(svgElement.getCTM())

    // Coords of mouse cursor, relative to SVG Canvas
    let mouseCoordsInCanvasSpace = mousePoint.matrixTransform(windowToCanvasTM)
    // Coords of mouse cursor in element coordinate space
    let mouseCoordsInElementSpace = mousePoint.matrixTransform(windowToElementTM)

    //
    // if (snap) {
    //   x = Math.floor(x / resolution) * resolution || 0
    //   y = Math.floor(y / resolution) * resolution || 0
    // }
    if (isTranslating) {
      let x = mouseCoordsInCanvasSpace.x - (transformStart.mouseToCanvas.x - transformStart.x)
      let y = mouseCoordsInCanvasSpace.y - (transformStart.mouseToCanvas.y - transformStart.y)

      if (snap && !shiftDown) {
        x = Math.floor(x / resolution) * resolution || 0
        y = Math.floor(y / resolution) * resolution || 0
      }

      setState(updateCurrent({
        x,
        y
      }))


    } else if (isScaling) {
      let {width, height, surface} = transformStart

      let startScalingP = this.makePoint(transformStart.x, transformStart.y)
      let mouseToScaleStartP = startScalingP.matrixTransform(windowToElementTM)


      switch (surface) {

        //top transform is broken; disabled
        case 1: // top
          // //to fix the bottom in place, we need to:
          // //get the starting Y coords and the starting height, add to get bottom Y
          // //subtract current mouse coords from bottom Y
          // height = (transformStart.y + transformStart.height) - mouseCoordsInCanvasSpace.y
          // //to get the new X coords we need to:
          // //get the current difference in height from start to current
          //
          // newY =  mouseCoordsInCanvasSpace.y - transformStart.mouseToElement.y
          break;
        case 2: // right
          width = width - transformStart.mouseToElement.x + mouseCoordsInElementSpace.x
          break;
        case 3: // bottom
          height = height - transformStart.mouseToElement.y + mouseCoordsInElementSpace.y
          break;

        //left scale is broken; disabled
        case 4: // left
          // width = width + mouseCoordsInElementSpace.x*-1
          // newX = mouseCoordsInCanvasSpace.x
          break;
      }

      // Coords of actual element top left corner in SVG space (not of bounding box!)
      let elementTopLeft = this.makePoint(0, 0).matrixTransform(elementToCanvasTM)

      let nextTransformParams = {
        origin: {x:0, y:0},
        translate: {x: elementTopLeft.x, y: elementTopLeft.y}
      }
      let elementCenter = this.makePoint(width/2, height/2).matrixTransform(elementToCanvasTM)

      console.log(
        transformStart.elementCenter.x - elementCenter.x,
        transformStart.elementCenter.y - elementCenter.y
      )

      // let newX = current.x - (transformStart.elementCenter.x - elementCenter.x)
      // let newY = current.y - (transformStart.elementCenter.y - elementCenter.y)
      let newWidth = Math.max(this.props.resolution, width)
      let newHeight = Math.max(this.props.resolution, height)
      if (snap && !shiftDown) {
        // newX = Math.floor(newX / resolution) * resolution || 0
        // newY = Math.floor(newY / resolution) * resolution || 0
        newHeight = Math.max(Math.floor(newHeight / resolution) * resolution || 0, this.props.resolution)
        newWidth = Math.max(Math.floor(newWidth / resolution) * resolution || 0, this.props.resolution)
      }

      setState({
        ...updateCurrent({
          width: newWidth,
          height: newHeight,
          // x: newX,
          // y: newY
        }),
        ...{
          transformParams: nextTransformParams
        }
      }
      )

    } else if (isRotating) {
      // initial click mouse coords (canvas space)
      let s_x = transformStart.mouseToCanvas.x
      let s_y = transformStart.mouseToCanvas.y
      // current drag mouse coords (canvas space)
      let h_x = mouseCoordsInCanvasSpace.x
      let h_y = mouseCoordsInCanvasSpace.y
      // transform origin
      let o_x = transformStart.x + transformStart.width/2 + transformStart.elementTopLeftCenterRotated.x
      let o_y = transformStart.y + transformStart.height/2 + transformStart.elementTopLeftCenterRotated.y

      // radians from origin to initial mouse
      let initalMouseRadians = Math.atan2(s_y - o_y, s_x - o_x)
      // radians from origin to current mouse
      let currentMouseRadians = Math.atan2(h_y - o_y, h_x - o_x)
      // radians of existing element rotation
      let elementRadians = (transformStart.rotation/360*(Math.PI*2))
      let radians = elementRadians + currentMouseRadians - initalMouseRadians
      let degree = (radians * (360 / (2 * Math.PI)));

      let nextTransformParams = {
        origin: {x:transformStart.width/2, y:transformStart.height/2},
        translate: {
          x: transformStart.elementTopLeft.x + transformStart.elementTopLeftCenterRotated.x,
          y: transformStart.elementTopLeft.y + transformStart.elementTopLeftCenterRotated.y
        }
      }

      if (snap && !shiftDown) {
        degree = Math.floor(degree / 10) * 10 || 0
      }

      let elementTopLeft = this.makePoint(0, 0).matrixTransform(elementToCanvasTM)
      console.log(elementTopLeft, transformStart.elementTopLeft, transformStart.elementTopLeftCenterRotated)


      setState({
        ...updateCurrent({
          rotation: degree,
          x: elementTopLeft.x,
          y: elementTopLeft.y
        }),
        ...{
          transformParams: nextTransformParams
        }
      })

    }
  };

  handleTranslate = (plantingid, e) => {
    const planting = this.props.plantings.find(p => p.id === plantingid)
    const ev = e.nativeEvent
    this.selectPlanting(planting)

    const {
      zoom,
      snap,
      resolution,
      setState
    } = this.props

    let svgElement = this.props.getSVG()
    let element = ReactDOM.findDOMNode(this.plantingInstances[planting.id])

    console.log('Does this return anykthings?')
    console.log(svgElement)
    console.log(svgElement.getCTM())

    //make a point at the current mouse coords, relative to window
    let mousePoint = this.makePoint(e.clientX, e.clientY)
    //transform matrix: window coords to main <SVG> element coords
    let windowToCanvasTM = this.props.getSVG().getScreenCTM().inverse().multiply(svgElement.getCTM())
    //transform matrix: element to mouse coords
    let windowToElementTM = element.getCTM().inverse().multiply(windowToCanvasTM)

    //coords: element relative to <SVG>
    // let elementCoordsToCanvas = this.makePoint(0, 0).matrixTransform(windowToElement)
    //coords: mouse relative to <SVG>
    // let mouseCoordsToCanvas = mousePoint.matrixTransform(windowToCanvasTM)
    //coords: mouse relative to clicked element
    let mouseCoordsInElementSpace = mousePoint.matrixTransform(windowToElementTM)

    //console.log('Element to canvas', elementCoordsToCanvas)
    //console.log('Mouse to element', mouseCoordsInElementSpace)

    let elementTransform = element.transform.baseVal.consolidate()
    let x = elementTransform.matrix.e
    let y = elementTransform.matrix.f

    // let x = elementCoordsToCanvas.x
    // let y = elementCoordsToCanvas.y
    // if (snap) {
    //   x = Math.floor(x / resolution) * resolution || 0
    //   y = Math.floor(y / resolution) * resolution || 0
    // }
    setState({
      selected: true,
      cursor: '-webkit-grabbing',
      current: planting,
      isTranslating: true,
      transformStart: {
        x,
        y,
        mouseToElement: mouseCoordsInElementSpace,
        mouseToCanvas: mousePoint.matrixTransform(windowToCanvasTM)
      }
    })
  };

  handleScale = (plantingid, surface, e) => {
    const planting = this.props.plantings.find(p => p.id === plantingid)

    this.selectPlanting(planting)

    let ev = e.nativeEvent

    const {
      zoom,
      padding,
      snap,
      resolution,
      setState
    } = this.props
    const {
      width,
      height
    } = planting
    // const ev = e.nativeEvent

    let svgElement = ReactDOM.findDOMNode(this.props.getSVG())
    let element = ReactDOM.findDOMNode(this.plantingInstances[planting.id])

    //make a point at the current mouse coords, relative to window
    let mousePoint = this.makePoint(e.clientX, e.clientY)

    //transform matrix: window coords to main <SVG> element coords
    let windowToCanvasTM = this.props.getSVG().getScreenCTM().inverse().multiply(svgElement.getCTM())
    //transform matrix: element to mouse coords
    let windowToElementTM = element.getCTM().inverse().multiply(windowToCanvasTM)
    // Transform from element to canvas coordinate spave
    let elementToCanvasTM = element.getCTM().multiply(svgElement.getCTM())
    //coords: mouse relative to clicked element
    let mouseCoordsInElementSpace = mousePoint.matrixTransform(windowToElementTM)
    // Coords of actual element top left corner in SVG space (not of bounding box!)
    let elementTopLeft = this.makePoint(0, 0).matrixTransform(elementToCanvasTM)
    let elementCenter = this.makePoint(width/2, height/2).matrixTransform(elementToCanvasTM)

    let x = ev.offsetX
    let y = ev.offsetY
    if (snap) {
      x = Math.floor(x / resolution) * resolution || 0
      y = Math.floor(y / resolution) * resolution || 0
    }
    setState({
      isScaling: true,
      transformStart: {
        x: planting.x,
        y: planting.y,
        width,
        height,
        surface,
        mouseToElement: mouseCoordsInElementSpace,
        elementTopLeft,
        elementCenter
      }
    })
  };

  handleRotate = (plantingid, e) => {
    const {
      setState,
      current
    } = this.props

    const planting = this.props.plantings.find(p => p.id === plantingid)

    let rotation = current.rotation || 0
    let {width, height, x, y} = current
    // this.selectPlanting(planting)

    let svgElement = ReactDOM.findDOMNode(this.props.getSVG())
    let element = ReactDOM.findDOMNode(this.plantingInstances[planting.id])

    //make a point at the current mouse coords, relative to window
    let mousePoint = this.makePoint(e.clientX, e.clientY)

    //transform matrix: window coords to main <SVG> element coords
    let windowToCanvasTM = this.props.getSVG().getScreenCTM().inverse().multiply(svgElement.getCTM())
    //transform matrix: element to mouse coords
    let windowToElementTM = element.getCTM().inverse().multiply(windowToCanvasTM)
    let elementToCanvasTM = element.getCTM().multiply(svgElement.getCTM())

    //coords: mouse relative to clicked element
    let mouseCoordsInElementSpace = mousePoint.matrixTransform(windowToElementTM)
    // Coords of mouse cursor, relative to SVG Canvas
    let mouseCoordsInCanvasSpace = mousePoint.matrixTransform(windowToCanvasTM)

    let elementTopLeft = this.makePoint(0, 0).matrixTransform(elementToCanvasTM)
    let elementCenter = this.makePoint(width/2, height/2).matrixTransform(elementToCanvasTM)

    var centerRotate = svgElement.createSVGMatrix().translate(width/-2, height/-2).rotate(rotation).translate(width/2, height/2)
    let elementTopLeftCenterRotated = this.makePoint(0,0).matrixTransform(centerRotate)
    console.log(centerRotate, elementTopLeftCenterRotated)

    setState({
      isRotating: true,
      transformStart: {
        x: current.x,
        y: current.y,
        width,
        height,
        rotation,
        mouseToElement: mouseCoordsInElementSpace,
        mouseToCanvas: mouseCoordsInCanvasSpace,
        elementTopLeft,
        elementCenter,
        elementTopLeftCenterRotated
      },
      transformParams: {}
    })
  };

  handleKeyDown = (e) => {
    const {
      plantings,
      current,
      width,
      height,
      snap,
      resolution,
      updateCurrent,
      setState
    } = this.props

    let nextState = {}
    let useSnap = snap

    if (e.metaKey || e.ctrlKey) {
      return
    }
    if (!current) {
      return
    }
    if (e.shiftKey) {
      nextState.shiftDown = true
      useSnap = false
    }
    if (e.altKey) {
      nextState.altDown = true
    }
    let {x, y} = plantings.find(p => p.id === current.id)
    switch (e.keyCode) {
      case 16:
        nextState.shiftDown = true
        break
      case 18:
        nextState.altDown = true
        break
      case 38: // Up
        e.preventDefault()
        if (y > 0) {
          y = useSnap ? y - resolution : y - 1
        }
        break
      case 40: // Down
        e.preventDefault()
        if (y) {
          y = useSnap ? y + resolution : y + 1
        }
        break
      case 37: // Left
        e.preventDefault()
        if (x > 0) {
          x = useSnap ? x - resolution : x - 1
        }
        break
      case 39: // Right
        e.preventDefault()
        if (x) {
          x = useSnap ? x + resolution : x + 1
        }
        break
    }
    setState({
      ...updateCurrent({x, y}),
      ...nextState
    })
  };

  handleKeyUp = (e) => {
    console.log('Keyup', e)
    let nextState = {}
    switch (e.keyCode) {
      case 16:
        nextState.shiftDown = false
        break
      case 18:
        nextState.altDown = false
        break
    }
    this.props.setState(nextState)
  };

  handleMouseOver = e => {
    //this.props.setCursor('-webkit-grab')
  };
  handleMouseOut = e => {

  };

  handleBackgroundClick = e => {
    this.props.deselectAll()
  };

  render () {
    let {width, height, plantings, current, cursor, setCursor, getSVG} = this.props

    return (
      <g
        id="plantings"
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onMouseUp={this.handleMouseUp}
      >
        {current &&
          <rect
            id="plantings-hitbox"
            x={0} y={0} width={width} height={height}
            onClick={this.handleBackgroundClick}
            stroke="none" fill="transparent"
          />}
        {plantings
        .map(planting => (
          <Planting
            ref={(c) => c && (this.plantingInstances[planting.id] = c)}
            key={planting.id}
            getSVG={getSVG}
            onTranslate={this.handleTranslate}
            onScale={this.handleScale}
            onRotate={this.handleRotate}
            onMouseUp={this.handleMouseUp}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            setCursor={setCursor}
            isSelected={current && current.id === planting.id}
            isTranslating={this.props.isTranslating}
            isScaling={this.props.isScaling}
            isRotating={this.props.isRotating}
            transformParams={this.props.transformParams}
            planting={planting}
            cursor={cursor}
          />)
        )}
      </g>
    )
  }

}
