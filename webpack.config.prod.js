const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin')

let babelConf;
if (fs.existsSync('./.babelrc')) {
  // use babel
  babelConf = JSON.parse(fs.readFileSync('.babelrc'));
}

module.exports = function (env = {}) {
  const externals = {};
  let filename = 'sprite-draggable.standalone.js';
  if (!env.standalone) {
    externals[ 'sprite-core' ] = 'spritejs';
    filename = 'sprite-draggable.js';
  }

  return {
    mode: 'production',
    entry: {
      index: path.resolve(__dirname, './src/index')
    },
    output: {
      path: path.resolve(__dirname, './lib'),
      filename: '[name].js',
      library: 'draggable',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: babelConf,
          },
        },
      ],

      /* Advanced module configuration (click to show) */
    }
    // lets you precisely control what bundle information gets displayed

    // list of additional plugins


    /* Advanced configuration (click to show) */
  };
};