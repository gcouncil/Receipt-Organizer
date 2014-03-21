var express = require('express');
var _ = require('lodash');
var routes = require('./routes');

function Application(config) {
  this.config = config || {};
  this.config.env = this.config.env || process.env.NODE_ENV || 'development';

  this.handlers = {
    receipts: require('./handlers/receipts-handler')()
  };

  var app = this.handler = express();

  app.set('env', this.config.env);

  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());

  routes(app, this.handlers, this.config);

  if (app.get('env') === 'development') {
    app.use(express.errorHandler());
  }
}

module.exports = Application;
