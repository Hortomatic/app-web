import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure';

import {Cover} from 'components/View'
import Plotter from 'components/Plotter'

import { actions as plotActions } from '../../redux/modules/plots'

const mapStateToProps = (state) => ({
  plantings: state.plantings,
  plants: state.plants,
  places: state.places
})

//return the last elemet of an array
function last (arr) {
  return arr[arr.length-1]
}

export class PlotsView extends React.Component {
  static propTypes = {
    // counter: React.PropTypes.number.isRequired,
    // doubleAsync: React.PropTypes.func.isRequired,
    // increment: React.PropTypes.func.isRequired
  };

  state = {
    dimensions: {},
    isMounted: false
  };

  componentDidMount = () => {
    setTimeout(() => this.setState({isMounted: true}), 20)
  };

  render () {
    const {plantings, plants, places} = this.props
    const {width, height} = this.state.dimensions

    let plottedPlantings = [...plantings.values()].filter(p => !!p.plotter).map(p => ({
      ...p.plotter,
      name: p.name,
      id: p.id
    }))

    return (
        <Measure
        onMeasure={(dimensions, mutations, target) => {
          console.log('Dimensions: ', dimensions);
          this.setState({dimensions})
        }}>
          <Cover style={{visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
            <Plotter {...{width, height, plantings:plottedPlantings}} />
          </Cover>

        </Measure>
    )
  }
}

export default connect(mapStateToProps, plotActions)(PlotsView)

const styles = StyleSheet.create({
})
