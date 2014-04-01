var path = require('path');
var Knex = require('knex');

module.exports = function(grunt) {
  var knex;

  function connect() {
    var config = grunt.config('appconfig');
    knex = knex || Knex.initialize({
      debug: true,
      client: 'pg',
      connection: {
        database: config.database.name,
      }
    });
  }

  grunt.registerTask('migrate', ['migrate:latest']);
  grunt.registerTask('migrate:latest', function() {
    connect();

    knex.migrate.latest({
      directory: path.join(__dirname, '../migrations'),
    }).exec(this.async());
  });

  grunt.registerTask('migrate:rollback', function() {
    connect();

    knex.migrate.rollback({
      directory: path.join(__dirname, '../migrations'),
    }).exec(this.async());
  });

  grunt.registerTask('migrate:make', function(name) {
    connect();

    knex.migrate.make(name, {
      directory: path.join(__dirname, '../migrations'),
    }).exec(this.async());
  });
};
