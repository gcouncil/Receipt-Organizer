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
  return knex.schema
  .table('items', function(t) {
    t.uuid('image');
  })
  .raw('UPDATE items SET image = images[1]')
  .table('items', function(t) {
    t.dropColumn('images');
  });
};
