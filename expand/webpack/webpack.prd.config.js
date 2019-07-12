const fs = require('fs');
const baseWebpackConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CreateJsonPlugin = require('../utils/createJsonPlugin');

baseWebpackConfig.module.rules.push({
    test: /\.css|.scss$/,
    use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader!sass-loader"
    })
});

const options = merge(baseWebpackConfig, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['script', 'style'],
        }),
        new ExtractTextPlugin({
            filename: 'style/[name].[md5:contenthash:hex:20].css'
        }),
        new CreateJsonPlugin({
            filename: 'version/prd-ver.json'
        })
    ]
});

module.exports = options;