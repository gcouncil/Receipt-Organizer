var express = require('express');
var passport = require('passport');
var Boom = require('boom');

var routes = require('./routes');

function Api(config) {
  this.config = config || {};
  this.config.env = this.config.env || process.env.NODE_ENV || 'development';

  this.config = require('config');

  this.services = {
    config: this.config,
    aws: require('./services/aws')(this.config),
    database: require('./services/database')(this.config)
  };

  this.managers = {
    users: require('./managers/users-manager')(this.services.database),
    items: require('./managers/items-manager')(this.services.database),
    images: require('./managers/images-manager')(this.services),
    folders: require('./managers/folders-manager')(this.services.database)
  };

  this.handlers = {
    users: require('./handlers/users-handler')(this.managers.users),
    items: require('./handlers/items-handler')(this.managers.items),
    images: require('./handlers/images-handler')(this.managers.images),
    folders: require('./handlers/folders-handler')(this.managers.folders)
  };

  this.events = require('./events')(this.managers);

  require('./authentication')(this.managers.users);

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
