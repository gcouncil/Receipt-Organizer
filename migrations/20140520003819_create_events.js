
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function(t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1()'));
    t.string('name').notNullable();
    t.json('data');
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events');
};
