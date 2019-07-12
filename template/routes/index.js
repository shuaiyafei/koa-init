const indexAction = require('../controller/indexAction');


module.exports = (router) => {
  router.get('/', indexAction.renderPage);
};