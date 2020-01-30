import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Listy from '../'

function wrap (component) {
  return (
    <div style={{display:'flex', width:'100%', minHeight: '100vh'}}>{component}</div>
  )
}

function renderListItem (i, data) {
  return (<div onClick={data.onSelect}>
    <div style={{
      transform: 'rotate(180deg)',
      textAlign:'right',
      fontWeight: data.isSelected ? 'normal' : 'bold'
      }}>{data.item}</div>
  </div>)
}

function searchFunction (item, searchString) {
  return new RegExp(searchString, 'i').test(item)
}

const filters = [
  {
    label: 'All',
    filter: (item, i) => true
  },
  {
    label: 'Short',
    filter: (item, i) => item.length < 4
  },
  {
    label: 'Last Half',
    filter: (item, i) => i > items.length / 2
  }
]
const items = ['Um', 'Dous', 'Tres', 'Quatro', 'Cinco', 'Seis', 'Sete', 'Oito', 'Nove', 'Dez']
storiesOf('Listy', module)
  .add('with empty items', () => (
    wrap(<Listy data={[]} filters={filters} />)
  ))
  .add('with items', () => (
    wrap(<Listy
      data={items}
      filters={filters}
      onItemClick={action('itemClick')}
      onChange={action('selectionChange')}
     />)
  ))
  .add('with custom item renderer', () => (
    wrap(<Listy
      data={items}
      filters={filters}
      itemRenderer={renderListItem}
      onItemClick={action('itemClick')}
      onChange={action('selectionChange')}
    />)
  ))
  .add('with search', () => (
    wrap(<Listy
      data={items}
      filters={filters}
      searchFunction={searchFunction}
      onItemClick={action('itemClick')}
      onChange={action('selectionChange')}
    />)
  ))
