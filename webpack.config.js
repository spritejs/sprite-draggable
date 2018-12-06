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
    mode: 'development',
    entry: './example/index',
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
    },

    externals,
    // Don't follow/bundle these modules, but request them at runtime from the environment

    stats: 'errors-only',
    // lets you precisely control what bundle information gets displayed

    devServer: {
      contentBase: path.join(__dirname, 'example'),
      compress: true,
      port: 9092,
      hot: true
      // ...
    },

    plugins: [
      // ...
      new HTMLPlugin({
        filename: "index.html",
        template: './example/test.html',
        inject: true
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};