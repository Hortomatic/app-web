'use strict'

const React = require('react')
const Immutable = require('immutable')
const cx = require('classnames')
const _ = require('lodash')
const TransitionGroup = require('react-addons-css-transition-group')

require('./Panel.css')

const Sheet = React.createClass({

  propTypes: {
    isActive: React.PropTypes.bool
  },

  getDefaultProps(){
    return {
      isActive: false
    }
  },

  render(){

    var hasItems = !!React.Children.count(this.props.children)
    var {
      data
    ,  ...props
    } = this.props
    return (
      <div {...props} className={cx('Panelled-Panel', this.props.className, {
        'Panelled-Panel--active': this.props.isActive
      ,  'Panelled-Panel--transitioning': this.props.isTransitioning
      ,  'Panelled-Panel--empty': !hasItems
      })}>
        {this.props.children}
      </div>
    )
  }

})

module.exports = Sheet
