'use strict';
module.exports = function(app) {
  var data = require('../controllers/restfulapiController');

  // todoList Routes
  app.route('/wikilist')
    .post(data.wiki_tags)
  
  app.route('/newslist')
    .post(data.news_tags)

  app.route('/hybridlist')
    .post(data.hybrid_tags)


  
};