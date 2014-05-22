exports.up = function(knex, Promise) {
  return knex.schema.createTable('reports', function(t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1()'));
    t.string('name').notNullable();
    t.specificType('items', 'uuid ARRAY').defaultTo('{}');
    t.uuid('user').references('id').inTable('users');

    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('reports');
};
