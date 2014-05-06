
exports.up = function(knex, Promise) {
  return knex.schema.renameTable('receipts', 'expenses');
};

exports.down = function(knex, Promise) {
  return knex.schema.renameTable('expenses', 'receipts');
};
