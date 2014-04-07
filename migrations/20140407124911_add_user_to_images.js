
exports.up = function(knex, Promise) {
  return knex.schema.table('images', function(t) {
    t.uuid('user').references('id').inTable('users').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('images', function(t) {
    t.dropColumn('user');
  });
};
