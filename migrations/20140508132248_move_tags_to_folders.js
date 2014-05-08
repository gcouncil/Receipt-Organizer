exports.up = function(knex, Promise) {
  return knex.schema.renameTable('tags', 'folders');
};

exports.down = function(knex, Promise) {
  return knex.schema.renameTable('folders', 'tags');
};
