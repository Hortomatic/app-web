import { configure } from '@kadira/storybook'

const components = require.context('../src/components', true, /stories\/index\.js$/)

require('./custom.css')
require('../src/static/css/App.css')

function loadStories() {
  components.keys().forEach(components)
}


configure(loadStories, module);
