exports.up = function(knex, Promise) {
  return Promise.resolve(true)
  .then(function() {
    return knex.schema.table('receipts', function(t) {
      t.dropColumn('tags');
    });
  })
  .then(function() {
    return knex.schema.table('receipts', function(t) {
      t.specificType('tags', 'uuid ARRAY').defaultTo('{}').notNullable();
    });
  });
};

exports.down = function(knex, Promise) {
  return Promise.resolve(true)
  .then(function() {
    return knex.schema.table('receipts', function(t) {
      t.dropColumn('tags');
    });
  }).then(function() {
    return knex.schema.table('receipts', function(t) {
      t.specificType('tags', 'uuid ARRAY');
    });
  });
};
