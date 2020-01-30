import React from 'react'

const TabSpacer = React.createClass({
  render() {
    return (
      <div className="Panelled-TabSpacer" style={{flex:1}}>
        {this.props.children}
      </div>
    )
  }
})

export default TabSpacer
