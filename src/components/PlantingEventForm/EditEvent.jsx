import React, {Component, PropTypes} from 'react'
import View, { Cover, Text } from 'components/View'
import { StyleSheet } from 'react-native-web'

import {SolidButton as Button, Panel as ButtonPanel} from 'components/Buttons'

import EventForm from './EventForm'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F1DF'
  }
})

export default class EditEvent extends Component {

  static propTypes = {
    l10n: PropTypes.func.isRequired,
    eventData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onTrash: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
    isSaved: PropTypes.bool
  };

  static defaultProps = {
    styles,
    isSaving: false,
    isSaved: false
  };

  l10n = (key, data) => {
    return this.props.l10n(key, data)
  };

  _change = (eventData) => {
    return this.props.onChange(eventData)
  };

  _save = () => {
    const {isSaving, isSaved} = this.props
    if (isSaved || isSaving) {
      return
    }
    return this.props.onSave()
  };

  _cancel = () => {
    return this.props.onCancel()
  };

  _trash = () => {
    return this.props.onTrash()
  };

  render () {
    const {isSaving, isSaved} = this.props

    return (
      <Cover style={{...styles, ...this.props.styles.container}}>
        {!isSaved ?
          <EventForm
            l10n={this.l10n}
            eventData={this.props.eventData}
            onChange={this._change}
            busy={isSaving}
            initialFocus={this.props.isFocused}
            key="EditEventPanel"
          />
        : <View style={{flexGrow:1, alignItems:'center', justifyContent:'center'}}><Text>Saved!</Text></View>
        }

        <ButtonPanel>
          <Button
            onClick={this._cancel}
            label={this.l10n('CancelButton')} />

          <Button
            onClick={this._trash}
            iconClass="fa fa-trash" />

          <Button
            onClick={this._save}
            label={this.l10n('SaveButton')}
            iconClass="fa fa-check"
            color="green"
            disabled={isSaved || false}
            busy={isSaving || false}
            kind="raised"
            align="right" />
        </ButtonPanel>
      </Cover>
    )
  }

}
