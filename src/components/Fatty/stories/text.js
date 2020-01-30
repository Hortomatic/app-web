import React from 'react'
import {storiesOf, action} from '@kadira/storybook'
import _ from 'lodash'

import {Text} from '../'
import {wrap} from './_utils'

storiesOf('Fatty.Text.singleLine', module)
  .add('unfilled', () => wrap(
    <Text />
  ))
  .add('unfilled, with label', () => wrap(
    <Text label='Field label' />
  ))
  .add('with placeholder', () => wrap(
    <Text label='Field label' placeholder='Placeholder text' />
  ))
  .add('with hint', () => wrap(
    <Text label='Field label' hint='Hint text' />
  ))
  .add('with help', () => wrap(
    <Text label='Field label' help='Some help text, can be much longer than a hint' />
  ))
  .add('with hint and help', () => wrap(
    <Text
      label='Field label'
      hint='Short hint'
      help='Some help text, can be much longer than a hint' />
  ))
  .add('with placeholder, hint, help', () => wrap(
    <Text
      label='Field label'
      placeholder='Placeholder text'
      hint='Short hint'
      help='Some help text, can be much longer than a hint' />
  ))
  .add('no label, with placeholder', () => wrap(
    <Text placeholder='Placeholder text' />
  ))
  .add('prefilled', () => wrap(
    <Text label='Field label' value='Text value' />
  ))

storiesOf('Fatty.Text.multiLine', module)
  .add('unfilled', () => wrap(
    <Text label='Field label' hint='Short hint' multiline={true} />
  ))
  .add('prefilled', () => wrap(
    <Text label='Field label' hint='Short hint' multiline={true} value={_.repeat('Some initial text value')} />
  ))
  .add('autogrow', () => wrap(
    <Text label='Field label' hint='Short hint' multiline={true} initialHeight={50} maxHeight={500} />
  ))
