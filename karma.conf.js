var webpack = require('webpack')

module.exports = function (config) {

  config.set({

    browsers: [ 'Chrome' ],
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha' ],

    files: [
      'tests.webpack.js',
      'examples/basic/app.css'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
      }
    },

    webpackServer: {
      noInfo: true
    }

  });

}
