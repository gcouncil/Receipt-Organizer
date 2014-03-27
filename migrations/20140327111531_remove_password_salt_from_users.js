
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('password_salt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.string('password_salt');
  });
};
