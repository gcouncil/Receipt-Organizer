
exports.up = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.uuid('user').references('id').inTable('users').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.dropColumn('user');
  });
};
