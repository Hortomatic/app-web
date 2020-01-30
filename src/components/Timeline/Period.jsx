import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'

import {View} from 'components/View'

function p(x,y){
  return x+" "+y+" ";
}

function roundedRect(x, y, w, h, [r1=0, r2=0, r3=0, r4=0]){
  var strPath = "M"+p(x+r1,y); //A
  strPath+="L"+p(x+w-r2,y)+"Q"+p(x+w,y)+p(x+w,y+r2); //B
  strPath+="L"+p(x+w,y+h-r3)+"Q"+p(x+w,y+h)+p(x+w-r3,y+h); //C
  strPath+="L"+p(x+r4,y+h)+"Q"+p(x,y+h)+p(x,y+h-r4); //D
  strPath+="L"+p(x,y+r1)+"Q"+p(x,y)+p(x+r1,y); //A
  strPath+="Z";

  return strPath;
}

const defaultStyle = { 
  strokeWidth: 0,
  fillOpacity: 0.5
}

export default class Period extends React.Component {
  static propTypes = {
    plotX: React.PropTypes.func,
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    style: React.PropTypes.object
  };

  static defaultProps = {
    style: defaultStyle
  };

  render () {
    const {children, plotX, yPos, from, to, style} = this.props
    const x = plotX(from);
    const width = plotX(to) - x
    return (
      <path d={roundedRect(x,yPos-10, width, 10, [3, 3])} style={{...defaultStyle, ...style}} />
    )
  }
}


