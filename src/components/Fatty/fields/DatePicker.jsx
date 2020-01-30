'use strict';

var React = require('react');
var cx = require('classnames');
var moment = require('moment');

var TransitionGroup = require('react-addons-css-transition-group');

var Field = require('../Field.jsx');

require('./DatePicker.css');

var DatePickerField = React.createClass({
  propTypes:{
    elementId: React.PropTypes.string,
    date: React.PropTypes.oneOfType([React.PropTypes.instanceOf(Date), React.PropTypes.string]),
    showDayName: React.PropTypes.bool,

    label: React.PropTypes.string,
    hint: React.PropTypes.string,
    help: React.PropTypes.string,
    collapse: React.PropTypes.bool,

    onChange: React.PropTypes.func
  },

  getDefaultProps(){
    return {
      showDayName: true
    }
  },

  getInitialState(){
    return {
      isFocused: false
    ,  editing: false
    ,  previousDate: undefined
    ,  focusedColumn: undefined
    ,  collapse: true
    }
  },

  componentDidUpdate(){
    //put focus into the
    if(this.state.editing && this.state.isFocused && !this.state.focusedColumn){
      this.refs.days.focus();
    }
  },

  focus(){
    //this.refs.Field.focus();
    if(!this.collapse){
      return this.refs.days.focus();
    }
  },

  edit(){
    this.setState({
      editing: true
    ,  previousDate: this.props.date
    });
    this.handleChange(this.props.date || new Date());
  },

  cancelEdit(){
    this.setState({
      editing: false
    ,  isFocused: false
    });
    !this.props.onChange || this.props.onChange(this.state.previousDate);
  },

  acceptEdit(){
    this.setState({
      editing: false
    ,  isFocused: false
    });
    !this.props.onChange || this.props.onChange(this.props.date);
  },

  handleFocus(ev){
    //if this is already focused, it means focus is moving between
    //the child input elements, so we can ignore it
    console.log('datepicker focus');

    this.setState({
      isFocused: true
    });
    this.edit();

    //this.refs.days
    !this.props.onFocus || this.props.onFocus(ev);
  },

  handleBlur(ev){
    console.log('datepicker blur');

    if(!require('react-dom').findDOMNode(this).contains(ev.relatedTarget)){
      this.setState({
        isFocused: false,
        focusedColumn: undefined,
        editing: false
      });
    }
    !this.props.onBlur || this.props.onBlur(ev);
  },

  handleStaticClick(){
    this.setState({
      isFocused: true
    });
    this.edit();
  },

  handleColumnFocus(ev, name){
    ev.stopPropagation();
    // this.handleFocus(ev);
    this.setState({
      isFocused: true,
      focusedColumn: name
    });

  },

  handleColumnBlur(ev, name){
    console.log(ev.relatedTarget);
    if(name!=="year" && require('react-dom').findDOMNode(this).contains(ev.relatedTarget))
      ev.stopPropagation();
  },

  handleChange(date){
    !this.props.onChange || this.props.onChange( moment.isMoment(date) ? date.toDate() : date);
  },

  render(){

    var {
      className
    ,  label
    ,  hint
    ,  help
    ,  multiline
    , tabIndex
    ,  ...props
    } = this.props;



    return (
      <Field
      className={cx("Fatty-Field-DatePicker", {'Fatty-Field-DatePicker--editing': this.state.editing})}
      tabIndex={tabIndex || "0"}
      label={label}
      hint={hint}
      help={help}
      isFocused={this.state.isFocused}
      isFilled={!!this.props.date}
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      ref="Field"
      >
      {this.state.editing===true || this.props.collapse===false
        ? this.renderPicker()
        : this.renderStatic()
      }
    </Field>);
  },

  renderStatic(){
    var formattedDate = '', date;

    if(this.props.date)
      date = moment(this.props.date);

    if(date){
      formattedDate = (
        <div className="Fatty-Field-DatePicker-staticDate-wrapper">
          <span className="Fatty-Field-DatePicker-staticDate-part Fatty-Field-DatePicker-staticDate-dayName">{date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'Today' : date.format('dddd')}</span>
          <span className="Fatty-Field-DatePicker-staticDate-part Fatty-Field-DatePicker-staticDate-date">{date.format('Do')}</span>
          <span className="Fatty-Field-DatePicker-staticDate-part Fatty-Field-DatePicker-staticDate-month">{date.format('MMMM')}</span>
          <span className="Fatty-Field-DatePicker-staticDate-part Fatty-Field-DatePicker-staticDate-year">{date.format('YYYY')}</span>
        </div>
      );
    }

    return (
      <div className="Fatty-Field-DatePicker-staticDate" onClick={this.handleStaticClick} key="static">
        <span className="">{formattedDate}</span>
        <i className="fa fa-calendar"></i>
      </div>
    );
  },

  renderPicker(){
    var date = moment(this.props.date || new Date());
    return (
      <div className="Fatty-Field-DatePicker-Columns" key="columns">
        {!this.props.showDayName
        || (
          <DayNameColumn date={date} />
        )}
        <Column name="day" date={date} onChange={this.handleChange} onFocus={this.handleColumnFocus} onBlur={this.handleColumnBlur} ref="days" />
        <Column name="month" date={date} onChange={this.handleChange} onFocus={this.handleColumnFocus} onBlur={this.handleColumnBlur} ref="months" />
        <Column name="year" date={date} onChange={this.handleChange} onFocus={this.handleColumnFocus} onBlur={this.handleColumnBlur} ref="years" />
        {this.props.collapse && <div className="Fatty-Field-DatePicker-Actions">
          <div className="Fatty-Field-DatePicker-action Fatty-Field-DatePicker-cancel" onClick={this.cancelEdit}><i className="fa fa-times"></i></div>
          <div className="Fatty-Field-DatePicker-action Fatty-Field-DatePicker-accept" onClick={this.acceptEdit}><i className="fa fa-check"></i></div>
        </div>}
      </div>
    );
  }

});

var formats = {
  year: 'YYYY',
  month: 'MMMM',
  day: 'Do'
};
var momentAccessorTerms = {
  year: 'year',
  month: 'month',
  day: 'date'
}

var Column = React.createClass({
  propTypes:{
    name: React.PropTypes.oneOf(['year', 'month', 'day'])
  ,  date: React.PropTypes.instanceOf(moment).isRequired
  ,  onChange: React.PropTypes.func.isRequired
  },

  getInitialState(){
    return {
      transitionDirection: 'down'
    , isFocused: false
    ,  editing: false
    ,  textValue: ''
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      transitionDirection: nextProps.date.isBefore(this.props.date) ? 'down' : 'up'
    });
  },

  focus(){
    this.refs.input.focus();
  },

  handleInputFocus(ev){
    // ev.stopPropagation();
    // ev.preventDefault();
    console.log('Column input focus');
    this.setState({
      isFocused: true
    });

    !this.props.onFocus || this.props.onFocus(ev, this.props.name);
  },

  handleInputBlur(ev){
    // ev.stopPropagation();
    console.log('Column input blur');
    //see if we can parse the value into a date
    var parsed;
    if(this.state.textValue){
      if( this.state.textValue.match(/^[0-9]{1,2}$/) ){
        parsed =  moment(this.state.textValue, formats[this.props.name].slice(0,2));
      }else{
        parsed = moment(this.state.textValue, formats[this.props.name])
      }
      var newDate = moment(this.props.date).set(momentAccessorTerms[this.props.name], parsed.get(momentAccessorTerms[this.props.name]));
      if(newDate.isValid()){
        this.props.onChange(newDate);
      }
    }
    this.setState({
      isFocused: false
    ,  textValue: ''
    ,  editing: false
    });

    !this.props.onBlur || this.props.onBlur(ev, this.props.name);
  },

  handleInputChange(e){
    this.setState({
      editing: !!e.target.value,
      textValue: e.target.value
    });
  },

  handleInputKeyDown(ev){
    console.log(ev.key);
    if(ev.key==='ArrowUp'){
      ev.preventDefault();
      ev.stopPropagation();
      this.prev();
    }
    if(ev.key==='ArrowDown'){
      ev.preventDefault();
      ev.stopPropagation();
      this.next();
    }
  },

  prev(){
    this.setState({textValue: ''});
    this.props.onChange( moment(this.props.date).subtract(1, this.props.name) );
  },

  next(){
    this.props.onChange( moment(this.props.date).add(1, this.props.name) );
  },

  render(){
    var format = formats[this.props.name]
    , date = moment(this.props.date)
    ;

    return (
      <div className={cx(
        "Fatty-Field-DatePicker-Column"
      ,  "Fatty-Field-DatePicker-Column-"+this.props.name
      ,  {
          "Fatty-Field-DatePicker-Column--focused": this.state.isFocused
        ,  "Fatty-Field-DatePicker-Column--editing": this.state.isFocused && !!this.state.textValue
        }
      )}>
        <div className="Fatty-Field-DatePicker-Column-prev" onClick={this.prev}>
          <i className="fa fa-chevron-up"></i>
        </div>
        <TransitionGroup component="div" className={cx("Fatty-Field-DatePicker-Column-dateWrapper","Fatty-Field-DatePicker-Column-"+this.state.transitionDirection+"Transition")} transitionName={"Fatty-Field-DatePicker-Transition"}>
          <div
          className={cx("Fatty-Field-DatePicker-Column-dateItem",
            "Fatty-Field-DatePicker-Column-"+this.props.name)}
          key={date.format(format)}>
            <div className="Fatty-Field-DatePicker-formatted">{date.format(format)}</div>
          </div>
        </TransitionGroup>
        <input className="Fatty-Field-DatePicker-Column-input"
          value={this.state.textValue}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          onKeyDown={this.handleInputKeyDown}
          ref="input" />
        <div className="Fatty-Field-DatePicker-Column-next" onClick={this.next}>
          <i className="fa fa-chevron-down"></i>
        </div>
      </div>
    );
  }
});

var DayNameColumn = React.createClass({
  propTypes:{
    date: React.PropTypes.instanceOf(moment).isRequired
  },

  getInitialState(){
    return {
      transitionDirection: 'down'
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      transitionDirection: nextProps.date.isBefore(this.props.date) ? 'down' : 'up'
    });
  },

  render(){
    var date = moment(this.props.date);
    return (
      <div className="Fatty-Field-DatePicker-Column Fatty-Field-DatePicker-Column-DayNames">
      <TransitionGroup component="div" className={cx("Fatty-Field-DatePicker-Column-dateWrapper","Fatty-Field-DatePicker-Column-"+this.state.transitionDirection+"Transition")} transitionName={"Fatty-Field-DatePicker-Transition"}>
        <div className="Fatty-Field-DatePicker-dayName" key={date.format('dddd')}>{date.format('dddd')}</div>
      </TransitionGroup>
      </div>
    );
  }

});

module.exports = DatePickerField;
