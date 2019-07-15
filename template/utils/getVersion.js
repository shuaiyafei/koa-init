const fs = require('fs');
const path = require('path');
const isDev = require('../utils/isDev');

module.exports = () => {
    let targetPath = path.resolve(__dirname, '../public/version/dev-ver.json');
    if (!isDev) {
        targetPath = path.resolve(__dirname, '../public/version/prd-ver.json');
    }
    let content = fs.existsSync(targetPath) ? fs.readFileSync(targetPath) : {};
    try {
        content = JSON.parse(content.toString());
    } catch (e) {
        content = {};
    }
    return content;
};