const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const {
    exec
} = require('child_process');
const PWD = process.env.PWD;

const getProjectName = (filename) => {
    const qs = [{
        message: '请输入要创建的项目名称',
        type: 'input',
        name: 'PROJECT_NAME',
        default: filename,
        validate(name) {
            const targetPath = path.resolve(__dirname, `../${name}`);
            const existStatus = fs.existsSync(targetPath);
            if (!existStatus) {
                fs.mkdirSync(targetPath);
            }
            return !!name;
        }

    }, {
        message: '请选择一种模板',
        type: 'list',
        name: 'PROJECT_TYPE',
        choices: [
            `koa2`,
            `koa2 + Vue + Vuex + Vue-Router + webpack`
        ]
    }]
    return inquirer.prompt(qs);
};



module.exports = async (n) => {
    let {
        PROJECT_NAME,
        PROJECT_TYPE
    } = await getProjectName(n);
    
    const sourcePath = `${path.resolve(__dirname, `../template`)}/*`;
    const targetPath = PWD + '/' + PROJECT_NAME;
    // 执行命令
    let command = `cp -r ${sourcePath} ${targetPath}`;
    exec(command, null, (err) => {
        if (PROJECT_TYPE.length > 10) {
            const reg = new RegExp(sourcePath);
            command = command.replace(reg, `${path.resolve(__dirname, `../expand`)}/*`);
            exec(command);
        }
    });
}