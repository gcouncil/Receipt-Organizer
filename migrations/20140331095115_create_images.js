var async = require('async');

exports.up = function(knex, Promise) {
  return Promise.promisify(async.series)([
    function(cb) {
      knex.schema.createTable('images', function(t) {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1()'));
        t.text('data');
        t.text('url');

        t.timestamps();
      }).exec(cb);
    },
    function(cb) {
      knex.schema.table('receipts', function(t) {
        t.uuid('image').references('id').inTable('images');
      }).exec(cb);
    }
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.promisify(async.series)([
    function(cb) {
      knex.schema.table('receipts', function(t) {
        t.dropColumn('image');
      }).exec(cb);
    },
    function(cb) {
      return knex.schema.dropTable('images').exec(cb);
    }
  ]);
};
