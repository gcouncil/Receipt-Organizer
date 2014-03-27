var Bookshelf = require('bookshelf');

module.exports = function(config) {
  return Bookshelf.initialize({
    debug: true,
    client: 'pg',
    connection: {
      database: config.database.name
    }
  });
};
