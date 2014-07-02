exports.up = function(knex, Promise) {
  return knex.schema
  .table('items', function(t) {
    t.specificType('images', 'uuid[]').defaultTo(knex.raw('ARRAY[]::uuid[]')).notNullable();
  })
  .raw('UPDATE items SET images = ARRAY[image]')
  .table('items', function(t) {
    t.dropColumn('image');
  });
};

exports.down = function(knex, Promise) {
  throw new Error('Cant rollback');
};
