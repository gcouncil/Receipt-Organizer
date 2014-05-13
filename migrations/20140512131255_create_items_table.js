exports.up = function(knex, Promise) {
  return knex.schema.createTable('items', function(t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1()'));
    t.string('type').notNullable();
    t.json('fields');
    t.specificType('folders', 'uuid ARRAY').defaultTo('{}').notNullable();
    t.boolean('reviewed').defaultTo(false);
    t.uuid('user').references('id').inTable('users');
    t.uuid('image').references('id').inTable('images');
    t.uuid('receipt').references('id').inTable('items');

    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('items');
};
