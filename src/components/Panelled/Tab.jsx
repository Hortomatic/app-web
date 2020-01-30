'use strict'

var React = require('react')
var cx = require('classnames')

var _ = require('lodash')

require('./Tab.css')

const Tab = React.createClass({

  propTypes: {
    label: React.PropTypes.string
  ,  icon: React.PropTypes.any
  ,  iconComponent: React.PropTypes.element
  ,  isActive: React.PropTypes.bool
  ,  onClick: React.PropTypes.func
  }

,  getDefaultProps(){
    return {
      isActive: false
    ,  onClick: ()=>{}
    }
  }

,  render(){
    return (
      <div
      className={cx("Panelled-Tab",  this.props.className, {
        'Panelled-Tab--active': this.props.isActive
      ,  'Panelled-Tab--hasLabel': !!this.props.label
      ,  'Panelled-Tab--hasIcon': !!this.props.icon || !!this.props.iconComponent
      })}
      onClick={this.props.onClick}
      >
        {this.props.label}
        {this.props.icon &&
          <div className="Panelled-Tab-icon">{this.props.icon}</div>
        }
        {this.props.iconComponent &&
          <this.props.iconComponent />
        }
      </div>
    )
  }

})

module.exports = Tab
