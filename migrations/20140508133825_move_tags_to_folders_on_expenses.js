
exports.up = function(knex, Promise) {
  return Promise.resolve(true)
  .then(function() {
    return knex.schema.table('expenses', function(t) {
      t.dropColumn('tags');
    });
  })
  .then(function() {
    return knex.schema.table('expenses', function(t) {
      t.specificType('folders', 'uuid ARRAY').defaultTo('{}').notNullable();
    });
  });
};

exports.down = function(knex, Promise) {
  return Promise.resolve(true)
  .then(function() {
    return knex.schema.table('expenses', function(t) {
      t.dropColumn('folders');
    });
  }).then(function() {
    return knex.schema.table('expenses', function(t) {
      t.specificType('tags', 'uuid ARRAY').defaultTo('{}').notNullable();
    });
  });
};
