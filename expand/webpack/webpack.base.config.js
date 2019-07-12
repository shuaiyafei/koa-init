const fs = require('fs');
const path = require('path');
const isDev = require('../utils/isDev');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const entryFile = fs.readdirSync(path.resolve(__dirname, '../views'));
const entry = {};
const output = {};

entryFile.forEach(item => {
    if (/\.html$/.test(item)) {
        const name = item.split('.')[0];
        if (name === 'spa') {
            Object.assign(entry, {
                [name]: path.resolve(__dirname, `../client/${name}/main.js`)
            });
        } else {
            Object.assign(entry, {
                [name]: isDev ? [path.resolve(__dirname, `../client/${name}/${name}.js`), 'webpack-hot-middleware/client?noInfo=true&reload=true'] : path.resolve(__dirname, `../client/${name}/${name}.js`)
            });
        }
        Object.assign(output, {
            path: `${path.resolve(__dirname, `./../public`)}`,
            filename: isDev ? `script/[name].[hash].js` : `script/[name].[chunkhash].js`,
        });
    }
});

const options = {
    entry,
    output,
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png|gif|jpeg|woff|svg|eot|ttf)$/,
                use: 'url-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

module.exports = options;