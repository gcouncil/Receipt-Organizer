
exports.up = function(knex, Promise) {
  return knex.schema.createTable('images', function(t) {
    t.uuid('uuid').primary().defaultTo('uuid_generate_v1()');
    t.text('data');
    t.text('url');

    t.timestamps();
  }).then(function() {
    return knex.schema.table('receipts', function(t) {
      t.uuid('image').references('uuid').inTable('images');
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.dropColumn('image');
  }).then(function() {
    return knex.schema.dropTable('images');
  });
};