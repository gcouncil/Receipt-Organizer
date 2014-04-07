var express = require('express');
var passport = require('passport');
var Boom = require('boom');

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
    images: require('./managers/images-manager')(this.services.database),
    tags: require('./managers/tags-manager')(this.services.database),
    taggings: require('./managers/taggings-manager')(this.services.database),
  };

  this.handlers = {
    users: require('./handlers/users-handler')(this.managers.users),
    receipts: require('./handlers/receipts-handler')(this.managers.receipts),
    images: require('./handlers/images-handler')(this.managers.images),
    tags: require('./managers/tags-handler')(this.managers.database),
    taggings: require('./managers/taggings-handler')(this.managers.database)
  };

  require('./authentication').TokenStrategy(this.managers.users);
  require('./authentication').LoginStrategy(this.managers.users);

  var app = this.handler = express();

  app.set('env', this.config.env);

  app.use(require('body-parser')({ limit: '1mb' }));
  app.use(require('method-override')());

  app.use(passport.initialize());

  routes(app, this.handlers, this.config);

  app.use(function(err, req, res, next) {
    if (!err.isBoom) {
      err = Boom.wrap(err);
    }

    if (err.output.statusCode >= 500) {
      console.error(err.stack);
    }

    res.json(err.output.statusCode, err.output.payload);
  });

  if (app.get('env') === 'development') {
    app.use(require('errorhandler')());
  }
}

module.exports = Api;
