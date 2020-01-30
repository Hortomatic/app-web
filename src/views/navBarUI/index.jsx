import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {StyleSheet} from 'react-native-web'
import {push} from 'react-router-redux'

import _ from 'lodash'
import translate from 'counterpart'
import createGetStyle from 'utils/getStyle'
import {View, Cover, Col, Row, Text} from 'components/View'
import {
  navBarTextColor as textColor,
  navBarSelectedColor as selectedColor
} from 'constants/theme'

import {
  actions,
  selector
} from 'redux/modules/navBarUI'

import {
  actions as addPlantingActions
} from 'redux/modules/addPlanting'

const l10n = {
  'NavBar.timeline': 'Timeline',
  'NavBar.plotter': 'Plotter',
  'NavBar.plantings': 'Plantings',
  'NavBar.journal': 'Journal',
  'NavBar.calendar': 'Calendar',
}
translate.setSeparator('*')
translate.registerTranslations('en', l10n)

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 0,
    flexBasis: 70,
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',

    paddingTop: 15,
    paddingRight: 20,
    paddingBottom: 15,
    paddingLeft: 15,

    cursor: 'pointer',
    outline: 'none',
    // transition: border .5s,

    borderTopWidth: 3,
    borderTopColor: 'transparent',

    alignItems: 'center'
  },
  tabIcon: {
    width: 32,
    height: 32,
    marginRight: 15
  },
  tabLabel: {
    color: textColor,
    fontWeight: '300',
    fontSize: 17
  },

  hovered: {
    tab: {

    },
    tabLabel: {
      color: selectedColor
    }
  },
  selected: {
    tab: {
      color: selectedColor,
      borderTopWidth: 3,
      borderColor: selectedColor,
      outline: 'none',
      backgroundColor: 'transparent'
    },
    tabLabel: {
      fontWeight: '700',
      color: selectedColor
    }
  },
  closed: {
    container: {
      marginTop: -70
    }
  }
})

const getStyle = createGetStyle(styles)

export class NavBarUI extends Component {

  static propTypes = {

  };

  // TODO move l10n into store
  l10n (key, data) {
    if (!l10n[key]) {
      return `No l10n for key ${key}`
    }
    return translate(key, data)
  }

  handleAddClick = (ev) => {
    // Trigger add planting action
    this.props.startAddPlantingFlow()
  };

  handleTabClick = (tab) => {
    // Trigger select tab action
    this.props.setSelectedTab(tab)
    this.props.setAppSection(tab)
  };

  handleTabMouseOver = (tab) => {
    // Trigger action
    this.props.setHoveredTab(tab)
  };

  handleTabsMouseLeave = () => {
    // Trigger action
    this.props.setHoveredTab(undefined)
  };

  render () {
    // console.log(this.props)
    const {isOpen, selectedTab, hoveredTab} = this.props

    var sections = ['timeline', 'plotter', 'journal', 'plantings', 'calendar'];
    var icons = ['timeline.svg', 'growspaces.svg', 'journal.svg', 'plantings.svg', 'calendar.svg']
    return (
    <Row style={getStyle('container', {closed: !isOpen})}>
      <Row
        style={getStyle('tabContainer')}
        onMouseLeave={this.handleTabsMouseLeave}
      >
        {sections.map( (s, i)=>{
          const tabState = {
            selected: selectedTab === s,
            hovered: hoveredTab === s
          }
          return (
            <Row
              style={getStyle('tab', tabState)}
              key={s}
              onMouseOver={e => this.handleTabMouseOver(s)}
              onClick={e => this.handleTabClick(s)}
              tabIndex={i}
            >
              <View style={{...getStyle('tabIcon'), backgroundImage: 'url('+require(`static/icons/modules/${icons[i]}`)+')'}}></View>
              <Text style={getStyle('tabLabel', tabState)}>{this.l10n(`NavBar.${s}`)}</Text>
            </Row>
            )
        })}
        <Row style={getStyle('tab')}>
          <View onClick={this.handleAddClick}><Text>+</Text></View>
        </Row>
      </Row>
      <View className="App-NavBar-export">
        <i className="fa fa-arrow-down" onClick={()=>this.handleNavClick('export')} />
      </View>
      <View className="App-NavBar-info">
        <i className="fa fa-ellipsis-h" onClick={()=>this.handleNavClick('info')} />
      </View>
    </Row>)
  }
}

export default connect((state, props) => ({
    routerProps: props,
    ...selector(state, props)
  }),
dispatch => ({
  setAppSection: name => { dispatch(push('/'+name)) },
  ...actions,
  ...addPlantingActions
}))(NavBarUI)
