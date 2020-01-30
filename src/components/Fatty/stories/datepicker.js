import React, {Component} from 'react'
import {storiesOf, action} from '@kadira/storybook'
import {DatePicker} from '../'
import {wrap} from './_utils'

const withState = function (component, state={}) {
  return <DateState initialState={state}>{component}</DateState>
}

let theDate = new Date('1985-02-11')

class DateState extends Component{
  state = this.props.initialState || {date: undefined};
  setDate = (date) => {
    this.setState({
      date: date
    })
  };
  render () {
    return (
        <div>{React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, {...this.state, onChange:this.setDate})
        })}</div>
    )
  }
}

function setDate (date) {
  theDate = date
}

storiesOf('Fatty.DatePicker', module)
  .add('unfilled', () => {
    let isSet = false
    return (
      wrap(withState(<DatePicker label="Choose a date" date={isSet ? theDate : undefined} />))
    )
  })
  .add('prefilled', () => (
    wrap(withState(<DatePicker label="Prefilled date" />, {date: new Date()}))
  ))
  .add('without day name', () => (
    wrap(withState(<DatePicker label="Showing day name" showDayName={false} />, {date: new Date()}))
  ))
  .add('always uncollapsed', () => (
    wrap(withState(<DatePicker label="Always Uncollapsed" collapse={false} />, {date: new Date()}))
  ))
  .add('compact', () => (
    wrap(withState(<DatePicker label="Compact with day name" />, {date: new Date()}), {width: '30%'})
  ))
