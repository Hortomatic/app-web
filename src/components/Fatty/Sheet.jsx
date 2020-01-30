'use strict';

var React = require('react');
var cx = require('classnames');

const defaultTheme = {
  sheet: {
    "background": "#F0F0E7"
  },
  field: {
    "background": "#FFFFFF"
  }
}

const whiteTheme = {
  sheet: {
    "background": "#FFFFFF"
  },
  field: {
    "background": "#F0F0E7"
  }
}

var FattySheet = React.createClass({
  propTypes:{
    size: React.PropTypes.oneOf(['supersize', 'regular', 'value'])
  ,  theme: React.PropTypes.oneOf(['cream', 'white'])
  },

  getDefaultProps(){
    return {
      size: 'regular'
    ,  theme: 'cream'
    }
  },

  getInitialState(){
    return {
    }
  },


  render(){
    var {
      className,
      ...props
    } = this.props;


    return (<div style={{defaultTheme}} {...props}>
      {this.props.children}
    </div>);
  }

});

module.exports = FattySheet;
