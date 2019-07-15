const fs = require('fs');

module.exports = (dir) => {
    let result = [];
    const next = (folderPath) => {
        fs.readdirSync(folderPath).forEach(path => {
            const fullPath = `${folderPath}/${path}`;
            if (fs.lstatSync(fullPath).isDirectory()) {
                next(fullPath);
            } else {
                result.push(fullPath);
            }
        });
    }
    next(dir);
    return result;
};