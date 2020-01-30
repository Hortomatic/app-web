require('./Fatty.less')
require('./Fatty.css')

module.exports = {
    mainClassName: 'Fatty',
    altClassNames:{
      slimmed: 'Fatty--slimmed',
      supersized: 'Fatty--supersized'
  },
    Field: require('./Field'),

    Text: require('./fields/Text'),
    Dropdown: require('./fields/Dropdown'),
    Pills: require('./fields/Pills.jsx'),
    DatePicker: require('./fields/DatePicker'),

    Sheet: require('./Sheet.jsx')
}
