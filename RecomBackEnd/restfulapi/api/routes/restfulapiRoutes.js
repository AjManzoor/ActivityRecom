'use strict';
module.exports = function(app) {
  var data = require('../controllers/restfulapiController');

  // todoList Routes
  app.route('/test')
    .post(data.test_function)
    


  
};