
exports.up = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.integer('user_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('receipts', function(t) {
    t.dropColumn('user_id');
  });
};
