'use strict'

const React = require('react')
const cx = require('classnames')
const _ = require('lodash')
const uncontrollable = require('uncontrollable')

export const Tab = require('./Tab.jsx')
export const TabSpacer = require('./TabSpacer.jsx')
export const Tabs = require('./Tabs.jsx')
export const Panel = require('./Panel.jsx')

require('./Panelled.css')

// clamp a number between -100 and 100
const clamp = num => Math.min(Math.max(num, -100), 100)

const Panelled = React.createClass({

  displayName: 'Panelled',

  propTypes: {
    activePanel: React.PropTypes.number,
    onChange: React.PropTypes.func,
    theme: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      activePanel: 0,
      theme: 'cream'
    }
  },

  componentWillReceiveProps (nextProps) {
    var direction

    this.prevActivePanel = this.props.activePanel
    /*if (nextProps.selectedDate !== this.props.selectedDate) {
      direction = nextProps.selectedDate > this.props.selectedDate ? 'up' : 'down'
      this.setState({
        transitionDirection: direction
      })
    }*/
  },

  _tabChange (index) {
    this.props.onChange(index)
  },

  render () {
    // iterate through props.children and pull out Panel elements
    let panels = React.Children.map(this.props.children, (child, index) => {
      if (!child || !child.type || child.type!==Panel) {
        return null
      }

      let childProps = {}

      childProps.className = child.props.className+' '

      if (childProps.isActive) {
        prevPanel = index
      }
      childProps.isActive = (this.props.activePanel === index)
      childProps.isTransitioning = (this.prevActivePanel === index)

      //move Panels into one of three X positions: -100%, 0% or 100%
      //a CSS transition on transform property takes care of animation
      childProps.style = {
        transform:'translate('+clamp(100*(index-this.props.activePanel))+'%,0)'
      ,  WebkitTransform: 'translate('+clamp(100*(index-this.props.activePanel))+'%,0)'
      ,  MozTransform: 'translate('+clamp(100*(index-this.props.activePanel))+'%,0)'
      }

      return React.cloneElement(child, childProps)
    }, this)

    return (
    <div className={cx('Panelled', this.props.className, 'Panelled--'+this.props.theme)}>

      <Tabs onChange={this._tabChange} activeIndex={this.props.activePanel}>
        {this.props.children}
      </Tabs>

      <div className="Panelled-panels">
        {panels}
      </div>

    </div>)
  }


})



const PanelledComponent = uncontrollable(Panelled,
  {
    'activePanel': 'onChange'
  }
)


export default PanelledComponent
