
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1()'));
    t.string('email').unique();
    t.string('password_hash');

    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
