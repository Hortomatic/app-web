import React, {Component} from 'react'
import moment from 'moment'
import momentRange from 'moment-range'
import Measure from 'react-measure'

import {action} from '@kadira/storybook'

require('./noScrollBounce.css')

export default function (Timeline) {
  return class WrappedTimeline extends Component {
    state = {
      from: this.props.initialFrom || moment().startOf('year').toDate(),
      to: this.props.initialTo || moment().endOf('year').toDate(),
      width: 1,
      height: 1,
      isMounted: false,
      debug: false
    };


    componentDidMount = () => {
      setTimeout(() => this.setState({isMounted: true}), 1)
    };



    handleDateRangeChange = (from, to) => {
      this.setState({
        from,
        to
      })
    };

    handleDebug  = () => {
      this.setState({debug: !this.state.debug})
    };
    handleZoomIn = (e) => {
      this.setState({
        from: moment(this.state.from).add(Math.floor(this._numDays / 10), 'days').toDate(),
        to: moment(this.state.to).subtract(Math.ceil(this._numDays / 10), 'days').toDate()
      })
    };
    handleZoomOut = (e) => {
      this.setState({
        from: moment(this.state.from).subtract(Math.ceil(this._numDays / 10), 'days').toDate(),
        to: moment(this.state.to).add(Math.floor(this._numDays / 10), 'days').toDate()
      })
    };
    handleMoveRight = (e) => {
      const numDays = e.altKey
        ? 1
        : this._numDays / 10
      this.setState({
        from: moment(this.state.from).add(numDays, 'days').toDate(),
        to: moment(this.state.to).add(numDays, 'days').toDate()
      })
    };
    handleMoveLeft = (e) => {
      const numDays = e.altKey
        ? 1
        : this._numDays / 10
      this.setState({
        from: moment(this.state.from).subtract(numDays, 'days').toDate(),
        to: moment(this.state.to).subtract(numDays, 'days').toDate()
      })
    };
    render () {
      this._numDays = moment.duration(moment.range(this.state.from, this.state.to).valueOf()).asDays()

      let svgStyles = this.state.debug
      ? {svg: {overflow: 'visible', transform:'scale(.4)', flex: 'initial'}}
      : {svg: {overflow: 'hidden', flex: 'initial'}}

      return (
        <Measure
          onMeasure={(dimensions, mutations, target) => {
          console.log('Dimensions: ', dimensions);
          this.setState({width: dimensions.width, height: dimensions.height})
          }}>
          <div style={{flex:'1 1', visibility:this.state.isMounted ? 'visible' : 'hidden'}}>
            <Timeline
              {...this.props}
              width={this.state.width}
              height={this.state.height}
              from={this.state.from}
              to={this.state.to}
              onMarkerChange={e => action('onMarkerChange')}
              onMarkerEditIntent={e => action('onMarkerEditIntent')}
              onDateRangeChange={ this.handleDateRangeChange}
              styles={svgStyles}
            />
            <div style={{position:'absolute', top:0, right:0, zIndex:999999}}>
              <button onClick={this.handleMoveLeft}>&lt;</button>
              <button onClick={this.handleZoomIn}>+</button>
              <button onClick={this.handleZoomOut}>-</button>
              <button onClick={this.handleMoveRight}>&gt;</button>
              <button onClick={this.handleDebug}>{this.state.debug ? 'Disable Debug' : 'Enable Debug'}</button>
            </div>
          </div>
        </Measure>
      )
    }
  }
}
