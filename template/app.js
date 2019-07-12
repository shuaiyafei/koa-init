const Koa = require('koa');
const Router = require('koa-router');
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
const routes = require('./routes');
const port = require('./config');
const getIp = require('./utils/getIp');

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

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - $ms`);
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