'use strict';

var React = require('react');
var cx = require('classnames');

var Field = require('../Field.jsx');
require('./Text.css');

var getInstanceCount = function(){
  var count = 0;
  return function(){
    return count++;
  }
}();


var Text = React.createClass({
  propTypes:{
    elementId: React.PropTypes.string,
    value: React.PropTypes.string,

    label: React.PropTypes.string,
    hint: React.PropTypes.string,

    onChange: React.PropTypes.func,

    multiline: React.PropTypes.bool,
    //this group of properties are only relevant when multi-line is true
    autogrow: React.PropTypes.bool,
    initialHeight: React.PropTypes.number,
    maxHeight: React.PropTypes.number
  },

  getDefaultProps(){
    return {
      textareaComponent: 'textarea',
      inputComponent: 'input',
      autogrow: false,
      multiline: false,
      value: ''
    }
  },

  componentWillMount(){
    this._controlId = "Fatty-Text-"+getInstanceCount();
  },

  componentWillReceiveProps(props){
    if(props.value!==this.state.value)
        this.setState({value: props.value})
  },

  getInitialState(){
    return {
      isFocused: false,
      height: this.props.initialHeight || 50,
      value: this.props.value, //maintaining internal state is a mysterious fix to input cursor jumping issues (see Morearty.DOM)
      showHelp: false,
      isScrolled: false
    }
  },

  focus(){
    this.refs.field.focus();
  },

  handleFocus(ev){
    this.setState({
      isFocused: true
    });
    !this.props.onFocus || this.props.onFocus(ev);
  },

  handleBlur(ev){
    this.setState({
      isFocused: false
    });
    !this.props.onBlur || this.props.onBlur(ev);
  },

  handleScroll(ev){
    console.log(ev.target.scrollTop);
    if(ev.target.scrollTop > 10){
      this.setState({'isScrolled': true});
    }else{
      this.setState({'isScrolled': false});
    }

  },

  handleChange(ev){
    if( this.props.multiline && this.props.autogrow ){
      var scrollHeight = this.refs.field.scrollHeight;
      this.setState({
        height: this.props.maxHeight && scrollHeight > this.props.maxHeight ? this.props.maxHeight : scrollHeight
      });
    }
    this.setState({
      value: ev.target.value
    });
    !this.props.onChange || this.props.onChange(ev);
  },

  focusField(){
    this.refs.field.focus();
  },

  render(){
    var {
      className
    ,  label
    ,  hint
    ,  help
    ,  multiline
    ,  ...props
    } = this.props;

    return (
      <Field className={cx(className, 'Fatty-Field-Text', {
      'Fatty-Field--scrolled': this.state.isScrolled
    })}
      label={label}
      hint={hint}
      help={help}
      isFocused={this.state.isFocused}
      isFilled={!!this.props.value || !!this.state.value}
      >
      {
        !!multiline
        ? this.renderTextarea(props)
        : this.renderInput(props)
      }
      </Field>);
  },

  renderTextarea(props){
    var {
      elementId
    ,  autogrow
    ,  rows
    ,  onChange
    ,  textareaComponent
    ,  value
    ,  ...other
    } = props;

    var style={}

    if(autogrow)
      style.height = Math.max(this.state.height, this.props.initialHeight);

    return (
      <textarea
        className="Fatty-Field-Text-control Fatty-Field-textarea"
        ref="field"
        id={this.props.elementId || this._controlId}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        value={this.state.value}
        onChange={this.handleChange}
        rows={rows}
        style={style}
        onScroll={this.handleScroll}
        {...other} />
    );
  },

  renderInput(props){
    var {
      elementId
    ,  autogrow //not needed but don't want to pass it on
    ,  rows //ditto
    ,  onChange
    ,  textareaComponent
    ,  value
    ,  placeholder
    ,  ...other
    } = props;

    return (
      <input
        className="Fatty-Field-Text-control Fatty-Field-input"
        ref="field"
        id={this.props.elementId || this._controlId}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        value={this.state.value}
        placeholder={this.state.isFocused ? placeholder : ''}
        {...other} />
    );
  }
});

module.exports = Text;
