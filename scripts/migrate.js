#!/usr/bin/env node

var path = require('path');
var config = require('config');

var knex = require('knex').initialize({
  debug: true,
  client: 'pg',
  connection: config.database
});


knex.migrate.latest({
  directory: path.join(__dirname, '../migrations')
}).exec(function(err) {
  process.exit(err ? 1 : 0);
});
