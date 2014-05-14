
exports.up = function(knex, Promise) {
  return knex.raw('CREATE SEQUENCE client_id_seq');
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP SEQUENCE client_id_seq');
};
