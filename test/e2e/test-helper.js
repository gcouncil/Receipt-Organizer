process.env.NODE_ENV = 'test';

var async = require('async');

var chai = require('chai');
chai.use(require('chai-as-promised'));

before(function(done) {
  this.app = require('epson-receipts/server');
  this.server = require('http').createServer(this.app);
  this.server.listen(9000, done);
});

after(function(done) {
  this.server.close(done);
});

beforeEach(function(done) {
  var knex = this.app.api.services.database.knex;
  knex('pg_catalog.pg_tables').select('tablename').where({ schemaname: 'public' }).exec(function(err, tables) {
    if (err) { return done(err); }

    async.each(tables, function(table, callback) {
      if (/^knex/.test(table.tablename)) { return callback(); }

      knex(table.tablename).truncate().exec(callback);
    }, done);
  });
});

module.exports = {
  rootUrl: 'http://localhost:9000/',
  expect: chai.expect
};
