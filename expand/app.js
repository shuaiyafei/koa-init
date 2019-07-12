const Koa = require('koa');
const Router = require('koa-router');
const {
  exec
} = require('child_process');
const app = new Koa();
const router = new Router();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const static = require('koa-static');
const path = require('path');
const ejs = require('ejs');
const webpack = require('webpack');
const routes = require('./routes');
const port = require('./config');
const getIp = require('./utils/getIp');
const getVersion = require('./utils/getVersion');

onerror(app);

app.use(bodyparser());
app.use(json());
app.use(logger());
app.use(static(__dirname + '/public'));
app.use(views(__dirname + '/views', {
  map: {
    html: 'ejs'
  }
}));

if (process.env.NODE_ENV === 'dev') {
  const webpackDevMiddleware = require('koa-webpack-dev-middleware');
  const webpackHotMiddleware = require('koa-webpack-hot-middleware');
  const webpackDevConfig = require('./webpack/webpack.dev.config');
  const compiler = webpack(webpackDevConfig);

  app.use(webpackDevMiddleware(compiler));
  app.use(webpackHotMiddleware(compiler));
}

if (process.env.NODE_ENV === 'prd') {
  const workerProcess = exec('webpack --config webpack/webpack.prd.config.js', {})
  workerProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
}
app.use(async (ctx, next) => {
  // 解决hash 文件没有生成的问题
  await new Promise((res) => {
    setTimeout(() => {
      res();
    }, 0);
  });
  Object.assign(ctx.state, {
    version: getVersion()
  });
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - $ms`);
});

router.get('/health_check', () => {
  console.log(1);
});

routes(router);
app.on('error', function (err, ctx) {
  console.log(err);
  logger.error('server error', err, ctx);
});

module.exports = app.listen(port, () => {
  const ip = getIp();
  console.log(`Listening on http://${ip}:${port}`);
});