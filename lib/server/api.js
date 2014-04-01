var express = require('express');
var routes = require('./routes');

function Api(config) {
  this.config = config || {};
  this.config.env = this.config.env || process.env.NODE_ENV || 'development';

  this.config = require('config');

  this.services = {
    database: require('./services/database')(this.config)
  };

  this.managers = {
    receipts: require('./managers/receipts-manager')(this.services.database),
    images: require('./managers/images-manager')(this.services.database)
  };

  this.handlers = {
    receipts: require('./handlers/receipts-handler')(this.managers.receipts),
    images: require('./handlers/images-handler')(this.managers.images)
  };

  var app = this.handler = express();

  app.set('env', this.config.env);

  app.use(require('body-parser')({ limit: '1mb' }));
  app.use(require('method-override')());

  routes(app, this.handlers, this.config);

  if (app.get('env') === 'development') {
    app.use(require('errorhandler')());
  }
}

module.exports = Api;
