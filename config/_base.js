/* eslint key-spacing:0 spaced-comment:0 */
import _debug from 'debug'
import path from 'path'
import { argv } from 'yargs'

const pkg = require('../package.json')

const debug = _debug('app:config:_base')
const config = {
  env : process.env.NODE_ENV,

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '../'),
  dir_client : 'src',
  dir_dist   : 'dist',
  dir_server : 'server',
  dir_test   : 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : 'localhost',
  server_port : process.env.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_css_modules     : true,
  compiler_enable_hmr      : false,
  compiler_source_maps     : true,
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '/',
  compiler_stats           : {
    chunks : true,
    chunkModules : true,
    colors : true
  },
  compiler_vendor : [
    "babel-polyfill",
    "counterpart",
    "d3-scale",
    "d3-time-format",
    "history",
    "hoodie-client",
    "immutable",
    // "lodash",
    "moment",
    "pouch-redux-middleware",
    "react",
    "react-addons-css-transition-group",
    "react-dom",
    "react-measure",
    // "react-native-web",
    "react-redux",
    "react-router",
    "redux",
    "redux-actions",
    "redux-saga",
    "redux-simple-router",
    "redux-thunk",
    "reselect",
    "uncontrollable"
  ],

  //compiler_vendor: Object.keys(pkg.dependencies),

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_enabled   : !argv.watch,
  coverage_reporters : [
    { type : 'text-summary' },
    { type : 'html', dir : 'coverage' }
  ]
}

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__DEBUG__'    : config.env === 'development' && !argv.no_debug,
  '__DEBUG_NEW_WINDOW__' : !!argv.nw
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
// const pkg = require('../package.json')

config.compiler_vendor = config.compiler_vendor
  .filter(dep => {
    if (pkg.dependencies[dep] || pkg.devDependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.\n` +
      `Consider removing it from vendor_dependencies in ~/config/index.js`
    )
  })

// ------------------------------------
// Utilities
// ------------------------------------
config.utils_paths = (() => {
  const resolve = path.resolve

  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args])

  return {
    base   : base,
    client : base.bind(null, config.dir_client),
    dist   : base.bind(null, config.dir_dist)
  }
})()

export default config
