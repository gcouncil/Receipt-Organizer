exports.up = function(knex, Promise) {
  return knex.schema.createTable('taggings', function(t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1()'));
    t.uuid('receipt').references('id').inTable('receipts').notNullable();
    t.uuid('tag').references('id').inTable('tags').notNullable();
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('taggings');
};
