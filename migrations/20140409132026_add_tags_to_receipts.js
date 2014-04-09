exports.up = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.specificType('tags', 'uuid ARRAY');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.dropColumn('receipts');
  });
};
