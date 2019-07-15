const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const colors = require('colors');
const getFiles = require('./getFiles');
const PWD = process.env.PWD;

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

const fileLog = (targetPath, filename) => {
    const filePaths = getFiles(targetPath);
    filePaths.forEach(path => {
        pathSplit = path.split('/');
        path = pathSplit[pathSplit.length - 1];
        !path.includes('.DS_Store') && console.log(`create ${path}`.info);
    });
    console.log(`\n 🛠  ${filename} create complete\n`.data);
    console.log(`cd ${filename} && npm install`.warn);
    console.log(`npm run dev\n`.warn);
};

const getProjectName = (filename) => {
    const questions = [{
        message: '请输入要创建的项目名称',
        type: 'input',
        name: 'PROJECT_NAME',
        default: filename,
        validate(name) {
            const targetPath = path.resolve(PWD, `./${name}`);
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
    return inquirer.prompt(questions);
};

module.exports = async (n) => {
    const {
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
            exec(command, null, () => {
                fileLog(targetPath, PROJECT_NAME);
            });
        } else {
            fileLog(targetPath, PROJECT_NAME);
        }
    });
};