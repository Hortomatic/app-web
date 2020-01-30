'use strict';

//libs
var Immutable = require('immutable');
var lz = require('lazy.js');
var _ = require('lodash');
var moment = require('moment');
var Morearty = require('morearty');
var React = require('react');
//var tweenState = require('react-tween-state');

var easingFunctions = require('../../lib/EasingFunctions.js');


//ui components
var TransitionGroup = require('react-addons-css-transition-group');

//@import "~node_modules/react-select/less/default.less";*/('react-select');

var less = require('./DatePicker.css');


//filters
//takes an immutable and returns whether boolean for whether or not it contains a 'trashed' property
var notTrashed = itm => !itm.has('trashed');

const DEFAULT_STACK_BEHAVIOR = 'ADDITIVE';
const DEFAULT_EASING = 'ease-in-out';
const DEFAULT_DURATION = 300;

const DEFAULT_HEIGHT = 420;
const DEFAULT_ROW_HEIGHT = 30;
const DEFAULT_SCROLL_TIME_PER_ROW = 80; //ms

const DEFAULT_WHEEL_TIMEOUT = 200;

const DATES_COL = 0;
const MONTHS_COL = 1;
const YEARS_COL = 2;

const COLUMN_MOMENT_ALTER_MAP = ['day', 'month', 'year'];
const COLUMN_MOMENT_GET_MAP = ['date', 'month', 'year'];
const COLUMN_LETTER_MAP = ['d', 'M', 'y'];
const COLUMN_FORMAT_MAP = ['D', 'MMMM', 'YYYY'];


module.exports = React.createClass({
	displayName: 'DatePicker',
	
	//mixins: [tweenState.Mixin],
	propTypes: {
		height: React.PropTypes.number,
		rowHeight: React.PropTypes.number,
		initialDate: React.PropTypes.oneOfType([
			React.PropTypes.instanceOf(Date),
			React.PropTypes.instanceOf(moment)
		]),
		onChange: React.PropTypes.func.isRequired, //will be called with a javascript Date object
		showDayNames: React.PropTypes.bool,
		collapse: React.PropTypes.bool,
	},
	
	getDefaultProps(){
		return {
			height: DEFAULT_HEIGHT,
			rowHeight: DEFAULT_ROW_HEIGHT,
			initialDate: moment(),
			tabIndex: 1,
			columnFormats: COLUMN_FORMAT_MAP,
			showDayNames: false,
			collapse: true
		}
	},
	
	getInitialState(){
		var colTopOffset = -(Math.floor(this.props.height/this.props.rowHeight)*this.props.rowHeight);
		return {
			selected: moment(this.props.initialDate),
			height:this.props.height,
			rowHeight:this.props.rowHeight,
			scrollTimePerRow: DEFAULT_SCROLL_TIME_PER_ROW,
			wheelTimeout: DEFAULT_WHEEL_TIMEOUT,
			
			dateOffset:0,
			monthOffset:0, 
			yearOffset:0,
			
			tweeningTo: undefined,
			
			rowOverShoot: [0,0,0],
			colOffsets: [0,0,0], //offsets for scrolling
			
			transitionRows: [0,0,0], //a count of additional rows for padding scroll transitions
			colTransitions: [[],[],[]], 
			//colIsScrolling: [false, false, false],
			
			tweenQueues: [[],[],[]], //date, month, year
			
			isFocused: false,
			focusedColumn: undefined
			
		}
	},
	
	
	setSelected(date){
		if(!moment.isMoment(date))
			throw 'Argument is not a moment instance';
		this.scrollColumnTo( DATES_COL, date);
		this.scrollColumnTo( MONTHS_COL, date);
		this.scrollColumnTo( YEARS_COL, date);
	},

	componentWillMount(){
	},

	componentDidMount() {
		/*if(this.props.height){
			this.setState({
				height:this.props.height
			})
		}*/
		
		//window.scrollColumn = this.scrollColumn.bind(this);
		//this.refs.months.scrollTop = this.state.height;
	},

	componentWillUnmount() {
	},
	


	handleFocus(ev){
		console.log('FOCUS');

		ev.stopPropagation();

		this.setState({
			isFocused: true
		});
		if(this.state.focusedColumn===undefined){
			this.refs.dates.focus();
		}
		if(this.props.onFocus)
			this.props.onFocus(ev);
			
	},
	handleBlur(ev){
		ev.stopPropagation();
	
		//only trigger the blur event when the event is bubbling up from
		//the blur event of the last column		
		if(this.focusedColumn===undefined && ev.target!==this.refs.picker){

			this.setState({
				isFocused: false
			});
			
			if(this.props.onBlur)
				this.props.onBlur(ev);
		}
	},
	handleKeyUp(ev){
		ev.stopPropagation();
		
		if(ev.key==='ArrowUp'){
			this.scrollColumnTo(
				this.state.focusedColumn, 
				moment(this.state.selected).add(1, COLUMN_MOMENT_ALTER_MAP[this.state.focusedColumn])
			);
		}
		else
		if(ev.key==='ArrowDown'){
			this.scrollColumnTo(
				this.state.focusedColumn, 
				moment(this.state.selected).subtract(1, COLUMN_MOMENT_ALTER_MAP[this.state.focusedColumn])
			);
		}
	},
	
	focusColumn(col, ev){
		ev.stopPropagation();
		this.setState({
			focusedColumn: col
		});
	},
	blurColumn(col, ev){
		//if it's the last column, consider the whole
		//component de-focused
		if(col===YEARS_COL){
			this.setState({
				focusedColumn:undefined
			});
		}else{
			ev.stopPropagation();
		}
	},
	

	itemClick(col, date, ev){
		var diff = this.state.selected.diff(date, COLUMN_MOMENT_ALTER_MAP[col]);
		
		console.log('scrolling '+COLUMN_MOMENT_ALTER_MAP[col]+'s by', diff);
		
		this.scrollColumn(col, diff);
	},
	

	
	
	normalizeScrollDelta( ev ){
		//return Math.min(100, delta/20 );
		var wheelDelta = ev.wheelData || 1;
		return (ev.deltaY-wheelDelta) / (ev.deltaMode === 1 ? 3 : 100);
	},
	
	
	//lifted from github: darsain/sly
	/*normalizeWheelDelta(event) {
		// wheelDelta needed only for IE8-
		scrolling.curDelta = ((o.horizontal ? event.deltaY || event.deltaX : event.deltaY) || -event.wheelDelta);
		scrolling.curDelta /= event.deltaMode === 1 ? 3 : 100;
		if (!itemNav) {
			return scrolling.curDelta;
		}
		time = +new Date();
		if (scrolling.last < time - scrolling.resetTime) {
			scrolling.delta = 0;
		}
		scrolling.last = time;
		scrolling.delta += scrolling.curDelta;
		if (abs(scrolling.delta) < 1) {
			scrolling.finalDelta = 0;
		} else {
			scrolling.finalDelta = round(scrolling.delta / 1);
			scrolling.delta %= 1;
		}
		return scrolling.finalDelta;
	},*/
	
	
	columnWheelStatus: {
		column: undefined,
		scrolling:false,
		delta: 0,
		last: 0
	},
	
	columnWheelTick( column ){
		
		//if the scroll wheel has moved to another column, abort this RAF loop
		if(this.columnWheelStatus.column !== column)
			return;
		
		
		//apply delta to column
		var delta = this.columnWheelStatus.delta;
		var state = this.state;
		
		if(delta)
			this.scrollColumn( column, -delta, false );
		
		if(Date.now() > this.columnWheelStatus.last + this.state.wheelTimeout ){
			
			this.columnWheelStatus = {
				column:undefined,
				scrolling:false,
				delta:0,
				last:0
			}
			var colOffset = state.colOffsets[column];
			var rowHeight = state.rowHeight;
			var numRows = colOffset / rowHeight;
			var colDelta = numRows % 1;
			
			var state = this.state;

			//the major scrolling has been done by scrollColumn
			//we now need to correct for any leftover pixels...
			if(Math.abs(colDelta) > 0 ){
				//if we're not half-way towards another row, snap back to the current row
				if( Math.abs(colDelta) < 0.5 ){
					this.scrollColumn( column, colDelta*-1);//, {duration:DEFAULT_DURATION/2, easing:'ease-out'});
				}else{
					//snap along to the next row...
					if(colDelta > 0){
						this.scrollColumn( column, 1 - colDelta);//, {duration:DEFAULT_DURATION/2, easing:'ease-out'});
					}else{
						this.scrollColumn( column, -1 - colDelta);//, {duration:DEFAULT_DURATION/2, easing:'ease-out'});
					}
					
				}
			}
		}else{
			requestAnimationFrame(this.columnWheelTick.bind(this, column ));
		}
		
		this.columnWheelStatus.delta = 0;
	},
	
	columnWheel( column, ev ){
		ev.preventDefault();
		ev.stopPropagation();
		//somehow it would be useful to normalize the delta globally
		var delta = this.normalizeScrollDelta( ev );
		
		//console.log(delta);
				
		if(this.columnWheelStatus.column !== column){
			this.columnWheelStatus.delta = 0;
			this.columnWheelStatus.scrolling = false;
			this.columnWheelStatus.column = column;
		}
		
		this.columnWheelStatus.delta += delta;
		this.columnWheelStatus.last = Date.now();
		
		if(this.columnWheelStatus.scrolling !== true){
			this.columnWheelStatus.scrolling = true;
			requestAnimationFrame( this.columnWheelTick.bind(this, column) );
		}

	},
	
	
	
	/**
	 * Scroll a column by a delta representing a number of rows,
	 * e.g. 1=1 row
	 * Anything more than 0.5 will tick over to the next item
	 * After `snapBackAfter` ms, the column will snap back to the nearest item.
	 *
	 * column: one of the column constants DATES_COL, MONTHS_COL or YEARS_COL
	 *	scrollDelta: +/-1 = +/- one row. float or integer.
	 * snapBackAfter: false to not snap back, or a number of miliseconds to wait before snapping back. Defaults to 100.
	 */
	scrollColumn( column, scrollDelta, transition ){
		
		
		/*
		ok let's try to understand this problem a little.
		
		...when the user scroll the mouse, the scrollDelta is usually going to be very small
		//so we need to translate the column by that amount
		//when that amount + the new scrollDelta exceeds rowheight
		//add X new rows, and remove the corresponding amount from the translate
		*/
		
		//console.log('scrollColumn %s by delta %s', column, scrollDelta);
		//if(snapBackAfter===undefined)
			//snapBackAfter = 300;
			
		if(transition===undefined)
			transition = true;
			
		var state = this.state;
		//var currentColOffset = state.colOffset[column];
		
		var rowHeight = this.props.rowHeight;
		var rowHeightToScroll = scrollDelta * rowHeight + state.rowOverShoot[column] * rowHeight;
		//calculate the whole number of rows to scroll
		var absWholeRowsToScroll = Math.floor(
				Math.abs(rowHeightToScroll) / rowHeight
			 //+ Math.abs(state.colOffsets[column]) / rowHeight
		);
		
		//console.log('total rows to scroll %s and remainder %s',	absWholeRowsToScroll, scrollDelta % rowHeightToScroll);
	
		var wholeRowsToScroll = rowHeightToScroll > 0 ? absWholeRowsToScroll : -absWholeRowsToScroll;
		
		
		//date letters corresponding to the columns
		//var tweeningTo = moment( state.selected ).add( -wholeRowsToScroll, COLUMN_LETTER_MAP[column]) ;
		//console.log('Tweening from %s to %s', state.selected.format('YYYY-MM-DD'), tweeningTo.format('YYYY-MM-DD'));
		
		//console.log('scrolling column', wholeRowsToScroll);
		
		//if we're scrolling at least one whole rolw, add some elements to the relevant end of the stack
		if(absWholeRowsToScroll >= 1){
			//if we want to scroll 1 (e.g. scroll the list up, from 2015-2014)
			//we have to add a row to the top, and then adjust the column top position by
			//that much so stop the list jumping in place
			//state.transitionRows[column] = -wholeRowsToScroll;

			//this works when clicking on a month, but breaks scrolling
			state.colOffsets[column] -= (wholeRowsToScroll * rowHeight) % rowHeight;
			
			//this works when scrolling, but fucks up when clicking
			state.colOffsets[column] -= wholeRowsToScroll * rowHeight;
			

			var remainingScrollOffset = rowHeightToScroll % rowHeight;
			state.colOffsets[column] = remainingScrollOffset;
			
			state.rowOverShoot[column] = remainingScrollOffset / rowHeight;
			
			console.log('Scrolling %s rows; remainingScrollDelta %s', absWholeRowsToScroll, remainingScrollOffset);

			
			//if there's already a column offset, so update it to take into account the rows we just added	
			if( Math.abs(state.colOffsets[column]) > 0 ){
				//state.colOffsets[column] -= wholeRowsToScroll * this.props.rowHeight;
				//state.colOffsets[column] -= wholeRowsToScroll * rowHeight;
				//state.colOffsets[column] -= scrollDelta * rowHeight;
			}/*else{
				state.colOffsets[column] -= scrollDelta * rowHeight;
			}*/
			
			
			
			var newSelected = moment(state.selected).add(-wholeRowsToScroll , COLUMN_MOMENT_ALTER_MAP[column]);
			
			console.log('Setting selected date from %s to %s', state.selected.format('YYYY-MM-DD'), newSelected.format('YYYY-MM-DD'));
			state.selected = newSelected;
			
			
			
			/*	console.log('Already at offset %s; adding %s to scroll to nearest whole number', state.colOffsets[column], state.colOffsets[column] - scrollDelta * this.props.rowHeight);

				state.colOffsets[column] = state.colOffsets[column] + (scrollDelta * this.props.rowHeight);
			}
			else{
				state.colOffsets[column] = wholeRowsToScroll * this.props.rowHeight;
			}*/

			
			//add a transition to the column for the next rener cycle
			/*if(transition){
				if(!_(transition).isObject())
					transition = {};
					
				var duration = Math.min( this.state.scrollTimePerRow*(this.state.height/rowHeight),  this.state.scrollTimePerRow * absWholeRowsToScroll);
				
				var transition = _({
					started: Date.now(),
					duration: duration,
					easing: DEFAULT_EASING,
					to_date: tweeningTo
				})
				.merge(transition)
				.value();
				
				state.colTransitions[column].push( transition );
			}else{
				//state.transitionRows[column] = 0;

				//state.selected.set(COLUMN_MOMENT_GET_MAP[col], transition.to_date.get(COLUMN_MOMENT_GET_MAP[col]));
			}*/

			
			this.setState(state);

		}else{
			//the scroll delta is less than one, so add it to the offset until it's over at least one row.
			//console.log('Scrolling less than one row', scrollDelta);
			//console.log('Current offset is %s, adding %s to equal %s', state.colOffsets[column], scrollDelta * this.props.rowHeight, state.colOffsets[column] + scrollDelta * this.props.rowHeight);
			state.colOffsets[column] += scrollDelta * this.props.rowHeight;
			state.rowOverShoot[column] += scrollDelta;

			//state.selected
			this.setState(state);
		}
		
		if(this.props.onChange)
			this.props.onChange(this.state.selected.toDate());

	},
	
	
	scrollColumnTo( col, date ){
		//make a new date based on the currently selecte date, altering only the relevant column
		var targetDate = moment(this.state.selected).set(COLUMN_MOMENT_GET_MAP[col], date.get(COLUMN_MOMENT_GET_MAP[col]));
		var diff = this.state.selected.diff( targetDate, COLUMN_MOMENT_ALTER_MAP[col] );
		
		//var targetDate = moment(this.state.selected).add(date.get(COLUMN_MOMENT_GET_MAP[col]), COLUMN_MOMENT_ALTER_MAP[col]);
		//var diff = this.state.selected.diff( date, COLUMN_MOMENT_ALTER_MAP[col] );
		
		this.scrollColumn( col, diff );
	},
	
	
	resetCol( col, transition, transitionIndex ){
		var state = this.state;
		//if(transition)
		
		state.colTransitions[col].splice(transitionIndex, 1);
		state.transitionRows[col] = 0;

		//state.selected.set(COLUMN_MOMENT_GET_MAP[col], transition.to_date.get(COLUMN_MOMENT_GET_MAP[col]));
	
		//find the actual number of days/months/years scrolled in order to make sure the date is updated properly...
		var rows = Math.floor(state.colOffsets[col] / state.rowHeight) * -1;
		console.log('adding %s %ss', rows, COLUMN_MOMENT_ALTER_MAP[col]);
		state.selected.add(rows, COLUMN_MOMENT_ALTER_MAP[col]);
		
		state.colOffsets[col] = 0;

		/*console.log('Updating column post transition, setting %s to %s', 
			COLUMN_MOMENT_GET_MAP[col], 
			transition.to_date.get(COLUMN_MOMENT_GET_MAP[col])+1
		);*/
		
		this.setState(state);
		if(this.props.onChange)
			this.props.onChange(state.selected.toDate());
	},
	
	
	
	monthsTouch(ev){
		console.log(ev);
	},
	
	getNumRows(){
		return Math.ceil(this.state.height / this.props.rowHeight);
	},



	render(){
		//console.log('rendering');
		//console.log('Selected date is ', this.state.selected.format());
		var 
			lastWeek = moment().subtract(1, 'w')
		, yesterday = moment().subtract(1, 'd')
		, today = moment()
		, tomorrow = moment().add(1, 'd')
		, nextWeek = moment().add(1, 'w')
		;
		
		var {
			showDayNames
		,	height
		,	rowHeight
		,	initialDate
		,	onChange
		, tabIndex
		,	...otherProps
		} = this.props;
		
		var colStyles = [];

			
		//add css transitions to columns
		/*this.state.colTransitions.forEach(function(transitionStack, col){
			transitionStack.forEach(function(transition, i){
				//add a transition to the element				
				colStyles[col].transition = 'transform '+transition.duration+'ms '+transition.easing;
				//remove the transition and reset the column to it's normal state after the transition 
				//is complete
				setTimeout(function(){
					this.resetCol( col, transition, i );
				}.bind(this), transition.duration);
				
			}.bind(this));
		}.bind(this));*/
	

		
		//to calculate the number of rows we have to copy what's done in renderCol:
		//take the number of rows, half and round up... see the start of renderCols 
		var rowsHeight = (Math.ceil(this.getNumRows()/2)*2) * this.props.rowHeight;
		var centred =  this.state.height/2 - rowsHeight/2 - this.props.rowHeight/2;
		var selectionRowTop = this.state.height/2  - this.props.rowHeight/2;
		
		var colStyles = [
			{top: centred},
			{top: centred},
			{top: centred}
		];
		this.state.rowOverShoot.forEach((multiplier, col)=>{
			colStyles[col].transform = 'translate(0,'+multiplier*this.props.rowHeight+'px)';
		});		
		
		return (
			<div className="DatePicker" 
				ref="picker"
				style={{position:'relative'}} 
				onFocus={this.handleFocus} 
				onBlur={this.handleBlur} 
				onKeyUp={this.handleKeyUp}
				tabIndex={tabIndex} 
			{...otherProps}>		
				
				<div className="DatePicker-selectionRow" style={{height:this.props.rowHeight, position:'absolute', top:selectionRowTop}}></div>

				<div className="DatePicker-columns">
					<div className="DatePicker-col DatePicker-dates" 
						style={{height: this.state.height}} 
						onWheel={this.columnWheel.bind(this, DATES_COL)} 
						onFocus={this.focusColumn.bind(this, DATES_COL)}
						onBlur={this.blurColumn.bind(this, DATES_COL)}
						tabIndex={this.state.isFocused ? tabIndex : -1}
						ref="dates">
					{/*<TransitionGroup transitionName="DatePicker-row__transition">*/}
						<div className="DatePicker-col_inner" style={colStyles[DATES_COL]}>{this.renderDates()}</div>
					{/*</TransitionGroup>*/}
					</div>
					<div className="DatePicker-col DatePicker-months" 
						style={{height: this.state.height}} 
						onWheel={this.columnWheel.bind(this, MONTHS_COL)} 
						onTouchMove={this.monthsTouch} 
						onFocus={this.focusColumn.bind(this, MONTHS_COL)}
						onBlur={this.blurColumn.bind(this, MONTHS_COL)}
						tabIndex={this.state.isFocused ? tabIndex : -1}
						ref="months">
							<div className="DatePicker-col_inner" style={colStyles[MONTHS_COL]}>{this.renderMonths()}</div>
					</div>
					<div className="DatePicker-col DatePicker-years" 
						style={{height: this.state.height}}
						onWheel={this.columnWheel.bind(this, YEARS_COL)} 
						onFocus={this.focusColumn.bind(this, YEARS_COL)}
						onBlur={this.blurColumn.bind(this, YEARS_COL)}
						tabIndex={this.state.isFocused ? tabIndex : -1}
						ref="years">
						<div className="DatePicker-col_inner" style={colStyles[YEARS_COL]}>{this.renderYears()}</div>
					</div>
				</div>

			</div>
		);
	},
	
	
	renderDates(){
		return this.renderCol(DATES_COL);
	},
	
	renderMonths(){
		return this.renderCol(MONTHS_COL);
	},
	
	renderYears(){
		return this.renderCol(YEARS_COL);
	},
	
	renderCol( col ){	
		var state = this.state;
		var numRows = this.getNumRows();
		//var extraRows = this.state.transitionRows[col];
		
		//if extraRows is -2, then it means we 
		var upperPadding = -Math.ceil(numRows/2);
		var lowerPadding =  Math.ceil(numRows/2);
		
		var selectedRowNum = Math.ceil(numRows/2);
		
		//console.log('rendering %ss from %s to %s', COLUMN_MOMENT_ALTER_MAP[col], upperPadding, lowerPadding)
		
		var dateRange = lz.range(upperPadding, lowerPadding).toArray().map( rel=>moment(this.state.selected).add( rel, COLUMN_LETTER_MAP[col]) );
		
		return dateRange.map(function(date, i){
			var classes=['DatePicker-row', 'DatePicker-'+COLUMN_MOMENT_ALTER_MAP[col]];
			
			if(date.get( COLUMN_MOMENT_GET_MAP[col] )===state.selected.get( COLUMN_MOMENT_GET_MAP[col] )
				&& state.transitionRows[col]===0 && this.columnWheelStatus.scrolling===false){
				classes.push('DatePicker-row--selected');
			}
			//console.log('Overshoot for %s column is %s', COLUMN_MOMENT_GET_MAP[col], this.state.rowOverShoot[col])
			
			//absolute number of rows this row is from the selected row
			var distanceFromSelected =  i - selectedRowNum;
			var absDistanceFromSelected = Math.abs(distanceFromSelected);
			//squash and translate the row the further it is from the selected row
			var multiplier =	Math.max(Math.min( distanceFromSelected/selectedRowNum+this.state.rowOverShoot[col] ,1),-1);
			var absMultiplier = Math.abs(multiplier);
			var scale = Math.max(0, 1 - (absDistanceFromSelected/selectedRowNum + this.state.rowOverShoot[col]*-1));
			
			var opacity = Math.max(0, 1 - absDistanceFromSelected/selectedRowNum);//+(absMultiplier * this.state.rowOverShoot[col]);
			
			var transformOrigin = -(i - selectedRowNum) * this.props.rowHeight + this.state.rowOverShoot[col] * this.props.rowHeight;
			
			var style = {
				height: this.props.rowHeight,
				lineHeight: this.props.rowHeight+'px',
				//transform: 'scale(1, '+scale+')',
				//transform: 'perspective(0) rotate3d(-1, 0, 0, '+(45*multiplier)+'deg) translate(0, '+translate+'px)',
				//transformOrigin: '50% '+transformOrigin+'px',
				opacity: opacity,
			};
			
			var formattedDate;
			if(this.props.showDayNames && col===DATES_COL){
				classes.push('DatePicker-day--withName');
				formattedDate = (<span className="DatePicker-day-nameAndDate">
					<span className="DatePicker-day-name">{date.format('dddd')} </span>
					<span className="DatePicker-day-date">{date.format(this.props.columnFormats[col])}</span>
				</span>);
			}else{
				formattedDate = date.format(this.props.columnFormats[col]);
			}
			
			return (
				<div className={classes.join(' ')} style={style} key={date.format('YYYY-MM-DD')} onClick={this.itemClick.bind(this, col, date)}>
					{formattedDate}
				</div>
			);
		}.bind(this));
	},

});
