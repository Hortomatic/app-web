import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'

export default class Background extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onMouseUp: PropTypes.func
  };

  static defaultProps = {
    onMouseUp: () => {},
    onMouseDown: () => {}
  };

  render () {
    let { width, height } = this.props

    let styles = {
      bg: {
        fill: '#E0DDC0'
      }
    }

    return (
      <g>
        <rect {...{...styles.bg, width, height}} onMouseDown={this.props.onMouseDown} onMouseUp={this.props.handleMouseUp} ref="background"  />
      </g>
    )
  }

}
