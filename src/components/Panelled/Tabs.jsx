'use strict'

var React = require('react')
var cx = require('classnames')

var _ = require('lodash')

import Panel from './Panel.jsx'
import Tab from './Tab.jsx'
import TabSpacer from './TabSpacer.jsx'

require('./Tabs.css')

var Tabs = React.createClass({

  propTypes: {
    activeIndex: React.PropTypes.number
  ,  onClick: React.PropTypes.func
  }

,  getDefaultProps(){
    return {
      activeIndex: 0,
      onChange: ()=>{}
    }
  }

,  _tabClick(i){
    this.props.onChange(i)
  }

,  render(){
    return (
      <div className="Panelled-Tabs">
        {React.Children.map(this.props.children, (child, i) => {
          if(!child || !child.type)
          return null
          if(child.type === Panel){
            if(child.props.tabComponent){
              return (
                <child.props.tabComponent
                  isActive={this.props.activeIndex === i}
                  isSelected={this.props.activeIndex === i}
                  onSelect={this._tabClick.bind(this,i)} />
                  )
            }
            else
            if(child.props.label || child.props.icon){
              return (
              <Tab
                className={child.props.tabClassName}
                label={child.props.label}
                icon={child.props.icon}
                iconComponent={child.props.iconComponent}
                onClick={this._tabClick.bind(this, i)}
                isActive={this.props.activeIndex === i} />
              )
            }
            return null
          }
          if(child.type === Tab || child.type === TabSpacer){
            return React.cloneElement(child, {isActive: this.props.activeIndex===i})
          }
        })}
      </div>
    )
  },

})

export default Tabs
