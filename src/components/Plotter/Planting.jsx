
import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

// const rotateArrow = require('raw!static/icons/rotate-arrow.svg')

export default class Planting extends Component {

  static propTypes = {
    getSVG: PropTypes.func.isRequired,
    onTranslate: PropTypes.func.isRequired,
    onScale: PropTypes.func.isRequired,
    onRotate: PropTypes.func.isRequired,
    onMouseUp: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    onMouseOut: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isTranslating: PropTypes.bool.isRequired,
    isScaling: PropTypes.bool.isRequired,
    isRotating: PropTypes.bool.isRequired,
    planting: PropTypes.object.isRequired
  };

  static defaultProps = {

  };

  render () {
    let { planting, isSelected, setCursor,
          onMouseOver, onMouseOut, onMouseMove, onMouseUp,
          onTranslate, onScale, onRotate,
          isTranslating, isScaling, isRotating,
          transformParams} = this.props
    let { name, progress, x, y, width, height, rotation, color } = planting

    if (isSelected){
      // console.log('rendering planting', planting.x, planting.y, planting.width, planting.height, planting);
    }

    color = color || '#F06F68'

    let styles = {
      body: {
        fill: '#FFF'
      },
      progress: {
        fill: color,
        y: -6
      },
      label: {
        fill: color,
        fontFamily: 'Museo Sans',
        fontSize: 16
      },
      caret: {
        fill: color
      },
      resizeHandle: {
        fill: color
      },
      rotateHandle: {
        stroke: color,
        fill: color
      },
      hitBox: {
        fill: '#fff',
        opacity: 0,
      }
    }

    let caretWidth = 6
    let handleRadius = 6
    let selectedHitPadding = 30

    let mainCursor = isSelected
      ? isTranslating
        ? '-webkit-grabbing'
        : '-webkit-grab'
      : 'pointer'

    let translateCoords = isSelected && transformParams.translate
      ? `${transformParams.translate.x}, ${transformParams.translate.y}`
      : `${x}, ${y}`

    let rotationOrigin = isSelected && transformParams.origin
      ? `${transformParams.origin.x}, ${transformParams.origin.y}`
      : '0 0'//`${width/2} ${height/2}`

    return (
      <g transform={`translate(${translateCoords}) rotate(${rotation} ${rotationOrigin})`}
        {...{onMouseOver, onMouseOut, onMouseMove, onMouseUp: e => onMouseUp(planting, e)}}
        ref={(el) => this.containerElement = el}
        id={planting.id}
      >
        <g>
          {isSelected &&
            <g>
              <rect x={-selectedHitPadding} y={-selectedHitPadding} width={width+selectedHitPadding*2} height={height+selectedHitPadding*2} {...{...styles.hitBox}} />
              <g
                transform="translate(-30,-30)"
                {...{...styles.rotateHandle}}
                style={{cursor: 'move'}}
                onMouseDown={e => onRotate(planting.id, e)}>
                <path d="M23.8363643,8 C14.5378971,8 7,15.5378971 7,24.8363643" id="curve" strokeWidth="5" fill="none"></path>
                <polygon id="top-arrow" stroke="none" points="23.7369053 0.425331375 31.8056808 7.64344416 24.2181128 14.3803494"></polygon>
                <polygon id="bottom-arrow" stroke="none" points="14.3803494 23.7369053 7.16223664 31.8056808 0.425331375 24.2181128"></polygon>
                <rect fill="transparent" stroke="none" x="0" y="0" width={30} height={30} />
              </g>
              <g
                transform={`translate(${width+30},${height+30}) rotate(180)`}
                {...{...styles.rotateHandle}}
                style={{cursor: 'move'}}
                onMouseDown={e => onRotate(planting.id, e)}>
                <path d="M23.8363643,8 C14.5378971,8 7,15.5378971 7,24.8363643" id="curve" strokeWidth="5" fill="none"></path>
                <polygon id="top-arrow" stroke="none" points="23.7369053 0.425331375 31.8056808 7.64344416 24.2181128 14.3803494"></polygon>
                <polygon id="bottom-arrow" stroke="none" points="14.3803494 23.7369053 7.16223664 31.8056808 0.425331375 24.2181128"></polygon>
                <rect fill="transparent" stroke="none" x="0" y="0" width={30} height={30} />
              </g>
              <rect
                x={-caretWidth}
                y={-caretWidth}
                width={width+caretWidth*2}
                height={height+caretWidth*2}
                {...{...styles.caret}} />
              {/*}<circle
              cx={width/2}
              cy={-caretWidth}
              r={handleRadius}
              {...{...styles.resizeHandle}}
              style={{cursor:'row-resize'}}
              onMouseDown={e => onScale(planting.id, 1, e)} />*/}
              <circle
                cx={width+caretWidth}
                cy={height/2}
                r={handleRadius}
                {...{...styles.resizeHandle}}
                style={{cursor: 'col-resize'}}
                onMouseDown={e => onScale(planting.id, 2, e)} />
              <circle
                cx={width/2}
                cy={height+caretWidth}
                r={handleRadius}
                {...{...styles.resizeHandle}}
                style={{cursor: 'row-resize'}}
                onMouseDown={e => onScale(planting.id, 3, e)} />
              {/*}<circle
              cx={-caretWidth}
              cy={height/2} r={handleRadius}
              {...{...styles.resizeHandle}}
              style={{cursor: 'col-resize'}}
              onMouseDown={e => onScale(planting.id, 4, e)} />*/}
            </g>
          }
          <rect width={progress ? width * progress : 0} height={6} {...{...styles.progress}}/>
          <g
            onMouseDown={e => onTranslate(planting.id, e)}
            style={{cursor:mainCursor}}>
            <rect x={0} y={0} width={width} height={height} {...{...styles.body}} ref="bodyRect" />
            <text x={4} y={22} {...{...styles.label}}><tspan>{name}</tspan></text>
          </g>
        </g>
      </g>
    )
  }

}
