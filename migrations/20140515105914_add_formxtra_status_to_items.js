exports.up = function(knex, Promise) {
  return knex.schema.table('items', function(t) {
    t.string('formxtra_status');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('items', function(t) {
    t.dropColumn('formxtra_status');
  });
};
