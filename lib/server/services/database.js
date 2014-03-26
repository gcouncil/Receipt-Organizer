var Bookshelf = require('bookshelf');

module.exports = function(config) {
  return Bookshelf.initialize({
    client: 'pg',
    connection: {
      database: config.database.name
    }
  });
};
