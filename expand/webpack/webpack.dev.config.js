const fs = require('fs');
const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CreateJsonPlugin = require('../utils/createJsonPlugin');
const getIp = require('../utils/getIp');
const port = require('../config/index');

baseWebpackConfig.module.rules.push({
  test: /\.css|.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: "css-loader!sass-loader"
  })
});

const options = merge(baseWebpackConfig, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: 'style/[name].[hash].css'
    }),
    new CreateJsonPlugin({
      filename: 'version/dev-ver.json'
    }),
    new OpenBrowserPlugin({
      url: `http://${getIp() ? getIp() : `127.0.0.1` }:${port}`
    })
  ]
});

module.exports = options;