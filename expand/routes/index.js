const indexAction = require('../controller/indexAction');
const spaAction = require('../controller/spaAction');

module.exports = (router) => {
  router.get('/', indexAction.renderPage);
  router.get('/notepad', spaAction.renderPage);
};