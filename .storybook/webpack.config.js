const path = require('path');

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?sourceMap',
          'postcss'
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          'style',
          'css?sourceMap',
          'postcss',
          'less'
        ]
      },
      { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
      { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
      { test: /\.svg(\?.*)?$/,   loader: 'file?prefix=svg/&name=[path][name].[ext]' },
      { test: /\.(png|jpg|gif)$/,    loader: 'url?limit=8192' }
    ]
  },
  resolve: {
    fallback: [
      path.resolve('./src')
    ],
    extensions: ['', '.js', '.jsx']
  }
}
