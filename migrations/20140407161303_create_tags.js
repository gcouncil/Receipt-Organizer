var async = require('async');

exports.up = function(knex, Promise) {
  return knex.schema.createTable('tags', function(t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1()'));
    t.string('name');
    t.uuid('user').references('id').inTable('users').notNullable();
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tags');
};
