process.env.NODE_ENV = 'test';
require('./support/coverage');

var Q = require('q');
var _ = require('lodash');

var chai = require('chai');
chai.use(require('chai-as-promised'));


before(function(done) {
  var self = this;

  this.app = require('epson-receipts/server');
  this.api = this.app.api;
  this.server = require('http').createServer(this.app);
  this.server.unref();

  this.factory = require('./support/factory')(this.api.managers);

  browser.driver.manage().window().setSize(1920, 1080);

  browser.call(function() {
    return Q.ninvoke(self.server, 'listen', 9000);
  });
});

beforeEach(function() {
  var knex = this.api.services.database.knex;

  browser.call(function() {
    return knex('pg_catalog.pg_tables').select('tablename').where({ schemaname: 'public' }).then(function(tables) {
      tables = _.map(tables, 'tablename');
      tables = _.reject(tables, function(table) { return /^knex/.test(table); });

      return knex.raw('TRUNCATE ' + tables.join(', ') + ' RESTART IDENTITY CASCADE');
    });
  });
});

afterEach(function() {
  browser.executeScript(function() {
    window.localStorage.clear();
  });
});

module.exports = _.extend({
  rootUrl: 'http://localhost:9000/app/',
  expect: chai.expect,
}, require('./support/authenticate-user'));
