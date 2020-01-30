'use strict';

var React = require('react');
var cx = require('classnames');
var uncontrollable = require('uncontrollable');

var Field = require('../Field.jsx');

require('./Pills.css');

var Pills = React.createClass({
  propTypes:{
    elementId: React.PropTypes.string,

    label: React.PropTypes.string,
    hint: React.PropTypes.string,

    data: React.PropTypes.array.isRequired,
    value: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string, React.PropTypes.number]),

    multiple: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func,
    onChange: React.PropTypes.func,

    valueField: React.PropTypes.string,
    textField: React.PropTypes.string,

    //this group of properties are only relevant when multi-line is true
    height: React.PropTypes.number,

  },

  getDefaultProps(){
    return {
      value: [],
      multiple: false,
      tabIndex: 0,
      valueField: 'value',
      textField: 'text'
    }
  },

  getInitialState(){
    return {
      isFocused: false
    }
  },

  getCurrentValue(){
    return !!this.props.value
      ? _.isArray(this.props.value)
        ? this.props.value
        : [this.props.value]
      : [];
  },

  componentDidMount(){

  },

  focus(){
    this.refs.items.firstChild.focus();
  },

  handleFieldClick(ev){
    /*this.setState({
      isFocused: true
    });*/
  },

  handleFieldFocus(ev){
    this.setState({
      isFocused: true
    });
  },

  handleFieldBlur(ev){
    this.setState({
      isFocused: false
    });
  },

  handleItemFocus(i, ev){
    this.setState({
      //isFocused: true,
      focusedIndex: i
    });
    !this.props.onFocus || this.props.onFocus(ev);
  },

  handleItemBlur(i, ev){

    if(!require('react-dom').findDOMNode(this).contains(ev.relatedTarget)){
      this.setState({
         isFocused: false
      });
    }else{
      ev.stopPropagation();
    }

    !this.props.onBlur || this.props.onBlur(ev);
  },

  handleItemClick(i, ev){
    ev.stopPropagation();
    this.toggleItem(i);
  },

  handleKeyUp(ev){

    if(this.state.isFocused){
      if(ev.key==="ArrowRight" || ev.key==="ArrowLeft"){
        ev.stopPropagation();
        ev.preventDefault();
        nextIndex = ev.key==="ArrowRight" ? this.state.focusedIndex+1 : this.state.focusedIndex-1;
        if(nextIndex<0 || nextIndex>this.props.data.length){
          this.refs['pill-'+this.state.focusedIndex].blur()
        }else{
          this.refs['pill-'+nextIndex].focus();
        }
      }
      if(ev.key===" " || ev.key==="Enter"){
        ev.stopPropagation();
        ev.preventDefault();
        this.toggleItem(this.state.focusedIndex);
      }
    }
  },

  toggleItem(i){
    var
      data = this.props.data
    ,  currentValue = this.getCurrentValue()
    ,  value
    ;

    //if it's already selected, deselect it

    if(currentValue.indexOf(data[i][this.props.valueField]) > -1){
      !this.props.onDeselect || this.props.onDeselect(data[i][this.props.valueField], data[i]);
      value = this.props.multiple ? _.without(currentValue, data[i][this.props.valueField]) : [];

    //else select it
    }else{
      if(!this.props.multiple){
        _(data).where({isSelected: true}).forEach(item=>{
          !this.props.onDeselect || this.props.onDeselect(item);
        });
      }
      !this.props.onSelect ||this.props.onSelect(data[i][this.props.valueField], data[i]);
      value = this.props.multiple ? this.props.value.concat(data[i][this.props.valueField]) : [data[i][this.props.valueField]];

    }

    console.log("emitting change", value);

    !this.props.onChange || this.props.onChange(value);
  },

  render(){
    var {
      className,
      ...props
    } = this.props;


    return (
      <Field
      className={cx(className,'Fatty-Field-Pills')}
      isFilled={true}
      isFocused={this.state.isFocused}
      onClick={this.handleFieldClick}
      onFocus={this.handleFieldFocus}
      onBlur={this.handleFieldBlur}
      onKeyUp={this.handleKeyUp}
      {...props}>
        {this.renderPills()}
      </Field>);
  },

  renderPills(){
    var currentValue = this.getCurrentValue();
    var items = _.map(this.props.data, (item, i)=>{
      var isSelected = currentValue.indexOf(item[this.props.valueField]) > -1;
      return (<div className={cx('Fatty-Field-Pills-item', {'Fatty-Field-Pills-item--selected': isSelected})}
        tabIndex={this.props.tabIndex}
        onClick={this.handleItemClick.bind(this, i)}
        onFocus={this.handleItemFocus.bind(this, i)}
        onBlur={this.handleItemBlur.bind(this, i)}
        key={i}
        ref={"pill-"+i}>{item[this.props.textField]}</div>);
    });
    return (
      <div className="Fatty-Field-Pills-items" ref="items">
        {items}
      </div>
    );
  }

});

module.exports = uncontrollable(Pills, {value: "onChange"});
