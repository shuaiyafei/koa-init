const fs = require('fs');
const path = require('path');
const idDev = require('../utils/isDev');

class BuildEndPlugin {
    constructor(props) {
        this.filename = props.filename;
    }
    fn(compilation) {
        const currentPath = path.resolve(__dirname, `../public/${this.filename}`);
        const chunkName = {};
        const chunkObj = compilation.chunks;
        
        chunkObj.forEach(item => {
            Object.assign(chunkName, {
                [item.name]: idDev ? compilation.hash : item.hash
            });
        });

        console.log(chunkName);
        if (!fs.existsSync(currentPath)) {
            fs.mkdir(`public/version`, () => {
                fs.writeFile(currentPath, JSON.stringify(chunkName), (err) => {
                    console.log(err);
                });
            });
        }
        fs.writeFile(currentPath, JSON.stringify(chunkName), (err) => {
            console.log(err);
        });
    }
    apply(compiler) {
        const afterEmit = (compilation, cb) => {
            this.fn(compilation);
            cb();
        }
        compiler.plugin('after-emit', afterEmit);
    }
}

module.exports = BuildEndPlugin;