'use strict';

var React = require('react');
var cx = require('classnames');
var uncontrollable = require('uncontrollable');

var getInstanceCount = function(){
  var count = 0;
  return function(){
    return count++;
  }
}();


var Field = React.createClass({
  propTypes:{
    elementId: React.PropTypes.string,

    isFocused: React.PropTypes.bool,
    isFilled: React.PropTypes.bool,
    showHelp: React.PropTypes.bool,

    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onKeyUp: React.PropTypes.func,

    label: React.PropTypes.string,
    hint: React.PropTypes.string,
    help: React.PropTypes.string
  },


  getDefaultProps(){
    return {
      showHelp: false,
      isFocused: false
    }
  },

  focus(){
    this.refs.Field.focus();
  },

  handleFocus(ev){
    !this.props.onFocus || this.props.onFocus(ev);
  },

  handleBlur(ev){
    !this.props.onBlur || this.props.onBlur(ev);
  },

  handleClick(ev){
    !this.props.onClick || this.props.onClick(ev);
  },

  handleKeyUp(ev){
    !this.props.onKeyUp || this.props.onKeyUp(ev);
  },


  getElementId(){
    if(this.props.elementId){
      return this.props.elementId;
    }
    if(!this._elementId)
      this.elementId = "Fatty-Field-"+getInstanceCount();
    return this._elementId;
  },

  render(){
    var {
      className
    ,  label
    ,  hint
    ,  help
    , elementId
    , onFocus
    , onBlur
    ,  isFocused
    ,  isFilled
    , tabIndex
    ,  showHelp
    ,  ...props
    } = this.props;


    return (
      <div className={cx(className, 'Fatty-Field', {
        'Fatty-Field--focused': this.props.isFocused
        ,  'Fatty-Field--filled': this.props.isFilled
        ,  'Fatty-Field--withLabel': !!this.props.label
        })}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onClick={this.handleClick}
        onKeyUp={this.handleKeyUp}
        tabIndex={tabIndex || false}
        ref="Field"
        {...props}
      >
        <div className="Fatty-Field-label">
          <label htmlFor={this.props._elementId} className="Fatty-Field-label-text">{label}</label>
          {!help || <div className="Fatty-Field-help">
            <div className="Fatty-Field-help-icon"
              onMouseEnter={ev=>this.props.onHelp(true)}
            onMouseLeave={ev=>this.props.onHelp(false)}>
              <i className="fa fa-question-circle"></i>
            </div>
            <div style={{display: this.props.showHelp ? 'block' : 'none'}} className={cx("Fatty-Field-help-bubble", {"Fatty-Field-help-bubble--active": this.props.showHelp})}>{help}</div>
          </div>
          }
        </div>
        {!hint || <div className="Fatty-Field-hint">{hint}</div>}
        <div className="Fatty-Field-controlWrapper">{React.cloneElement(this.props.children, {
          isFocused: this.props.isFocused,
          isFilled: this.props.isFilled,
          elementId: this.getElementId()
        })}
        </div>
        <div className="Fatty-Field-background"></div>
    </div>);
  },

});

module.exports  = uncontrollable(
  Field,
  /* define the pairs ->*/
  { showHelp: 'onHelp'});
