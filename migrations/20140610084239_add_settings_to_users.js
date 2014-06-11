exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.json('settings');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('settings');
  });
};
