exports.up = function(knex, Promise) {
  return knex.schema.table('reports', function(t) {
    t.boolean('reimbursed');
    t.text('comments');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('reports', function(t) {
    t.dropColumn('reimbursed');
    t.dropColumn('comments');
  });
};
