exports.up = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.boolean('reviewed').defaultTo(false).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.dropColumn('reviewed');
  });
};
