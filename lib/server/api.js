var express = require('express');
var passport = require('passport');

var routes = require('./routes');

function Api(config) {
  this.config = config || {};
  this.config.env = this.config.env || process.env.NODE_ENV || 'development';

  this.config = require('config');

  this.services = {
    database: require('./services/database')(this.config)
  };

  this.managers = {
    users: require('./managers/users-manager')(this.services.database),
    receipts: require('./managers/receipts-manager')(this.services.database),
    images: require('./managers/images-manager')(this.services.database)
  };

  this.handlers = {
    users: require('./handlers/users-handler')(this.managers.users),
    receipts: require('./handlers/receipts-handler')(this.managers.receipts),
    images: require('./handlers/images-handler')(this.managers.images)
  };

  require('./authentication').TokenStrategy(this.managers.users);
  require('./authentication').LoginStrategy(this.managers.users);

  var app = this.handler = express();

  app.set('env', this.config.env);

  app.use(require('body-parser')({ limit: '1mb' }));
  app.use(require('method-override')());

  app.use(passport.initialize());

  routes(app, this.handlers, this.config);

  if (app.get('env') === 'development') {
    app.use(require('errorhandler')());
  }
}

module.exports = Api;
