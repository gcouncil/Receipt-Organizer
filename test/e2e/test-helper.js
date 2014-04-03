process.env.NODE_ENV = 'test';

var Q = require('q');
var _ = require('lodash');

var chai = require('chai');
chai.use(require('chai-as-promised'));

function wrapAsync(fn) {
  return function() {
    return Q.nbind(fn, this)();
  };
}

before(wrapAsync(function(done) {
  this.app = require('epson-receipts/server');
  this.api = this.app.api;
  this.server = require('http').createServer(this.app);
  this.server.listen(9000, done);
  this.server.unref();

  this.factory = require('./support/factory')(this.api.managers);
}));

beforeEach(wrapAsync(function(done) {
  var knex = this.api.services.database.knex;
  knex('pg_catalog.pg_tables').select('tablename').where({ schemaname: 'public' }).exec(function(err, tables) {
    if (err) { return done(err); }

    tables = _.map(tables, 'tablename');
    tables = _.reject(tables, function(table) { return /^knex/.test(table); });

    knex.raw('TRUNCATE ' + tables.join(', ') + ' RESTART IDENTITY CASCADE').exec(done);
  });
}));

module.exports = _.extend({
  wrapAsync: wrapAsync,
  rootUrl: 'http://localhost:9000/',
  expect: chai.expect,
}, require('./support/authenticate-user'));
