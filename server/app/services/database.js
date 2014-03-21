var Bookshelf = require('bookshelf');

module.exports = function(config) {
  return Bookshelf.initialize(config.database);
};
