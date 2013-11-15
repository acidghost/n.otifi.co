/**
 * Created by acidghost on 15/11/13.
 */

var sails = require('sails'),
    express = require('../node_modules/sails/node_modules/express');

module.exports.express = {

  customMiddleware: function(app) {
      if(sails.config.environment === 'development') {
        app.use(express.logger());
      }
  }

};