var pg = require('pg.js');

module.exports = function(config) {
  var client = new pg.Client(config.database);
  client.connect();

  function connect(callback) {
    pg.connect(config.database, callback);
  }

  return {
    connect: connect,
    connection: client
  };
};
