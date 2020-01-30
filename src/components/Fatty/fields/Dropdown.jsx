'use strict';

var _ = require('lodash');
var React = require('react');
var cx = require('classnames');

var Field = require('../Field.jsx');
var {Multiselect} = require('react-widgets');

require('react-widgets/lib/less/react-widgets.less');
require('./Dropdown.css');

var instanceCounter = 0;

var Dropdown = React.createClass({
  propTypes:{
    elementId: React.PropTypes.string
  ,  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array])
  ,  data: React.PropTypes.array.isRequired
  ,  multiple: React.PropTypes.bool
  ,  label: React.PropTypes.string
  ,  hint: React.PropTypes.string
  ,  help: React.PropTypes.string

  ,  valueField: React.PropTypes.string
  ,  textField: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func])
  ,  onChange: React.PropTypes.func
  ,  onBlur: React.PropTypes.func
  ,  onFocus: React.PropTypes.func
  },

  getDefaultProps(){
    return {
      multiple: false
    ,  valueField: "value"
    ,  textField: "text"
    }
  },

  getInitialState(){
    return {
      unmatchedValue: undefined,
      isFocused: false
    }
  },

  componentDidMount(){

  },

  componentWillReceiveProps(props){
    this._needsValueFlush = false;
    this.setState({ value: props.value });
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

    // the user moved away from the widget and its still not a list item
    if (this.state.unmatchedValue) {
      //we should trigger a create event here!
      this.setState({
        unmatchedValue: ''
      });
    }
    this.setState({
      isFocused: false
    });
    !this.props.onBlur || this.props.onBlur(ev);
  },

  handleChange(values){
    if(!this.props.multiple)
      values = values.pop();

    !this.props.onChange || this.props.onChange(values);
  },

  handleSearch(value){
    //clear any existing values when a search value is entered in single mode
    if(!this.props.multiple && (_.isNumber(this.props.value) || !_.isEmpty(this.props.value)) )
      this.props.onChange([]);
    this.setState({unmatchedValue: value});
  },


  render(){
    var {
      elementId
    ,  className
    ,  multiple
    ,  label
    ,  hint
    , placeholder
    ,  help
    ,  options
    ,  value
    ,  onFocus
    ,  onBlur
    ,  onChange
    ,  ...props
    } = this.props;

    /*if(!value){
      if(selectedIndex===undefined && menuItems[0].payload!==undefined){
        //if there's no preset value, add a blank item
        menuItems.unshift({payload:undefined, text:'Select an option...'});
      }
    }else{
      if(selectedIndex===undefined){
        props.selectedIndex = _.findIndex(menuItems, itm=>itm.payload===value);
      }
    }*/

    return (<Field className={cx("Fatty-Field-Dropdown", {"Fatty-Field-Dropdown--multiple": multiple, "Fatty-Field-Dropdown--single": !multiple})}
      label={label}
      hint={hint}
      help={help}
      isFocused={this.state.isFocused}
      isFilled={_.isNumber(value) || !_.isEmpty(value) || !!this.state.unmatchedValue}
      >
        <Multiselect
          value={value}
          searchTerm={this.state.unmatchedValue}
          {...props}
          placeholder={this.state.unmatchedValue || this.props.value ? null : placeholder}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onCreate={this.props.onCreate} />
    </Field>);
  }
});

module.exports = Dropdown;
