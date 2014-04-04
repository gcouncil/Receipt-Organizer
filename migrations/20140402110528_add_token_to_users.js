
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.string('token');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('token');
  });
};
