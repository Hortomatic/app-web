import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'

import View from 'components/View'

export default class NavBar extends Component{
	render(){
		var sections = ['timeline', 'plots', 'journal', 'plantings','growspaces', 'plants'];
		var icons = ['journal.svg', 'journal.svg', 'journal.svg', 'plantings.svg', 'growspaces.svg', 'plantings.svg']
		return (
		<View style={styles.NavBar}>
			<View style={styles.TabContainer}>
				{sections.map( (s, i)=>(
					<Link to={`/${s}`} style={styles.Tab} key={s}>
						<View style={{...styles.TabIcon, backgroundImage: 'url('+require(`file!static/icons/modules/${icons[i]}`)+')'}}></View>
						<View className="NavBar-Tab-label">{/*this.l10n('NavBar-SectionTab-'+s)*/ s}</View>
					</Link>
				))}
			</View>
			<View className="App-NavBar-export">
				<i className="fa fa-arrow-down" onClick={()=>this.handleNavClick('export')} />
			</View>
			<View className="App-NavBar-info">
				<i className="fa fa-ellipsis-h" onClick={()=>this.handleNavClick('info')} />
			</View>
		</View>)
	}
}

const styles = StyleSheet.create({
  NavBar: {
  	display: 'flex',
  	flexDirection: 'row',
   	backgroundColor: 'white',
   	justifyContent: 'space-between'
  },
  TabContainer: {
  	display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  Tab: {
  	display: 'flex',
    flexDirection: 'row',

    paddingTop: 15,
    paddingRight: 20,
    paddingBottom: 15,
    paddingLeft: 15,

    cursor: 'pointer',
    // transition: border .5s,

    borderTopWidth: 3,
    borderTopColor: 'transparent',

    alignItems: 'center'
  },
  TabHover: {
  	color: '#f06f68',
    outline: 'none',
    backgroundColor: 'transparent'
  },
  TabActive: {
  	color: '#f06f68',
    borderTopWidth: 3,
    borderColor: '#f06f68',
    outline: 'none',
    backgroundColor: 'transparent'
  },
  TabIcon: {
  	width: 32,
    height: 32,
    marginRight: 5
  }
})
