import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'
import {Cover} from 'components/View'
import Listy from 'components/Listy'

import PlantingListItem from './PlantingListItem.jsx'

const defaultStyles = StyleSheet.create({
  container: {
    flexBasis: '40%'
  }
})

export default class PlantingList extends Component{
  static propTypes = {
    currentPlantings: PropTypes.object.isRequired,
    selectedPlantingId: PropTypes.string,
    onSelectionChange: PropTypes.func,
    activePanelIndex: PropTypes.number,
    onPanelChange: PropTypes.func,
    styles: PropTypes.object
  };

  static defaultProps = {
    selectedPlantingIds: [],
    activePanelIndex: 0,
    styles: defaultStyles
  };

  handleItemPlaceClick = (item) => {
    // this.$set('activeListPanel', 5);
    // this.$set('listFilters', Immutable.fromJS([{filterName: 'place_id', valueName:item.get('place_id')}]));
  };

  handlePanelChange = () => {

  };

  handleSelectionChange = (selectedItems) => {
    this.props.onPlantingChange(selectedItems[0] && selectedItems[0].id || undefined)
  };

  itemRenderer = (i, props) => {
    return <PlantingListItem {...props} onPlaceClick={this.handleItemPlaceClick} />
  };

  render () {
    const {
      currentPlantings,
      selectedPlantingId,
      onSelectionChange,
      activePanelIndex,
      onPanelChange,
      filterOptions,
      filterFunction,
      styles
    } = this.props

    let data = Array.from(currentPlantings.values())

    return (
      <Cover style={{...defaultStyles.container,...styles.container}}>
        <Listy
          theme="cream"
          data={data}
          selectedItems={data.filter(p => p.id === selectedPlantingId)}
          onChange={this.handleSelectionChange}
          maintainItemSelection={true}

          activePanel={activePanelIndex}
          onPanelChange={this.handlePanelChange}

          itemRenderer={this.itemRenderer }
          searchFunction={(itm, string) => itm.name.match(string)}
          filterOptions={filterOptions}
          filterFunction={filterFunction}

          /*filterValues={}*/
          onFilterChange={filters=>{
          this.$set('listFilters', filters)
          }}
          filters={[
          {label: 'Current', filter: item=>true}
          ]}
          onItemClick={this.handleItemClick}
        />
      </Cover>
    )
  }
}
