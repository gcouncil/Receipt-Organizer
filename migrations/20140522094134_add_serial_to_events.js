exports.up = function(knex, Promise) {
  return knex.schema.table('events', function(t) {
    t.specificType('scopes', 'varchar ARRAY');
    t.specificType('serial', 'bigserial');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.table('events', function(t) {
    t.dropColumn('scopes');
    t.dropColumn('serial');
  });
};
