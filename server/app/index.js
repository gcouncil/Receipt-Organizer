var express = require('express');
var routes = require('./routes');

function Application(config) {
  this.config = config || {};
  this.config.env = this.config.env || process.env.NODE_ENV || 'development';

  this.managers = {
    receipts: require('./managers/receipts-manager')()
  };

  this.handlers = {
    receipts: require('./handlers/receipts-handler')(this.managers.receipts)
  };

  var app = this.handler = express();

  app.set('env', this.config.env);

  app.use(require('body-parser')());
  app.use(require('method-override')());

  routes(app, this.handlers, this.config);

  if (app.get('env') === 'development') {
    app.use(require('errorhandler')());
  }
}

module.exports = Application;
