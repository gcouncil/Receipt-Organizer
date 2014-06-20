var express = require('express');
var passport = require('passport');
var Boom = require('boom');

var routes = require('./routes');

var EventsRepository = require('./repositories/events-repository');
var EventsService = require('./services/events');
var MailerService = require('./services/mailer');
var FoldersRepository = require('./repositories/folders-repository');
var ItemsRepository = require('./repositories/items-repository');
var UsersRepository = require('./repositories/users-repository');

function Api(config) {
  this.config = config || {};
  this.config.env = this.config.env || process.env.NODE_ENV || 'development';

  this.config = require('config');

  this.services = {};
  this.repositories = {};

  this.services.config = this.config;
  this.services.aws = require('./services/aws')(this.config);
  this.services.database = require('./services/database')(this.config);
  this.services.postgres = require('./services/postgres')(this.config);
  this.services.formxtra = require('./services/formxtra')(this.config);


  this.repositories.events = new EventsRepository(this.services.postgres, null);
  this.services.events = new EventsService(this.repositories.events, this.services.postgres.connection);

  this.repositories.items = new ItemsRepository(this.services.postgres, this.services.events);
  this.repositories.folders = new FoldersRepository(this.services.postgres, this.services.events);
  this.repositories.users = new UsersRepository(this.services.postgres, this.services.events);

  this.managers = {
    clients: require('./managers/clients-manager')(this.services.postgres.connection),
    events: require('./managers/events-manager')(this.repositories.events, this.services.events),
    users: require('./managers/users-manager')(this.repositories.users),
    items: require('./managers/items-manager')(this.repositories.items),
    images: require('./managers/images-manager')(this.services),
    folders: require('./managers/folders-manager')(this.repositories.folders),
    reports: require('./managers/reports-manager')(this.services.postgres.connection)
  };

  this.actions = {
    recognize: require('./actions/recognize-actions')(this.services, this.managers)
  };

  this.handlers = {
    clients: require('./handlers/clients-handler')(this.managers.clients),
    events: require('./handlers/events-handler')(this.managers.events),
    items: require('./handlers/items-handler')(this.managers.items),
    images: require('./handlers/images-handler')(this.managers.images),
    folders: require('./handlers/folders-handler')(this.managers.folders),
    reports: require('./handlers/reports-handler')(this.managers.reports)
  };

  this.workers = require('./workers')(this.services, this.managers, this.actions);

  this.events = require('./events')(this.services.events, this.managers, this.workers);

  this.services.mailer = new MailerService(this.services);

  this.mailers = {
    users: require('./mailers/users/users-mailer')(this.services.mailer)
  };

  this.handlers.users = require('./handlers/users-handler')(this.managers.users, this.mailers.users);

  require('./authentication')(this.managers.users);

  var app = this.handler = express();

  app.set('env', this.config.env);

  app.use(require('body-parser')({ limit: '4mb' }));
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
