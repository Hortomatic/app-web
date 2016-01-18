import { argv } from 'yargs'
import config from '../config'
import webpackConfig from './webpack.config'

const debug = require('debug')('app:karma')
debug('Create configuration.')

const karmaConfig = {
  basePath: '../', // project root in relation to bin/karma.js
  plugins: [
    require('karma-webpack'),
    require('karma-mocha'),
    require('karma-tap'),
    require('karma-chrome-launcher'),
    require('karma-phantomjs-launcher'),
    require('karma-coverage'),
    require('karma-tap-reporter')
  ],
  files: [
    './node_modules/phantomjs-polyfill/bind-polyfill.js',
    {
      pattern: `./${config.dir_test}/**/*.js`,
      watched: false,
      served: true,
      included: true
    }
  ],
  singleRun: !argv.watch,
  frameworks: ['tap', 'mocha'],// 'chai-sinon', 'chai-as-promised', 'chai', ],
  preprocessors: {
    [`${config.dir_test}/**/*.js`]: ['webpack']
  },
  reporters: ['tap'],//, 'spec'],
  browsers: ['PhantomJS'],//, 'Chrome'],
  webpack: {
    devtool: 'inline-source-map',
    resolve: webpackConfig.resolve,
    plugins: webpackConfig.plugins
      .filter(plugin => !plugin.__KARMA_IGNORE__),
    module: {
      loaders: webpackConfig.module.loaders,
      postLoaders: [{
        test: /\.js$/,
        exclude: /(test|node_modules)\//,
        loader: 'istanbul-instrumenter'
      }]
    },
    node : {
      fs: 'empty' //for tape
    }
  },
  webpackMiddleware: {
    noInfo: true
  },
  coverageReporter: {
    reporters: config.coverage_reporters
  },

  port: 9876,
  colors: true,
  logLevel: config.LOG_WARN,
  autoWatch: true,
}

if (config.coverage_enabled) {
  karmaConfig.reporters.push('coverage')
  // karmaConfig.webpack.module.preLoaders = [{
  //   test: /\.(js|jsx)$/,
  //   include: new RegExp(config.dir_client),
  //   loader: 'isparta'
  // }]
  // 
}

export default (cfg) => cfg.set(karmaConfig)
