exports.up = function(knex, Promise) {
  return knex.schema.table('tags', function(t) {
    t.specificType('path', 'uuid ARRAY');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('tags', function(t) {
    t.dropColumn('path');
  });
};
