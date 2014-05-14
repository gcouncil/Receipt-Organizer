var pg = require('pg');

module.exports = function(config) {
  var client = new pg.Client(config.database);

  client.connect();

  return client;
};
