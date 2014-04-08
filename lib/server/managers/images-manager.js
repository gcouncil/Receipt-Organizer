var domain = require('epson-receipts/domain');

module.exports = function(Bookshelf) {
  var Image = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'images',
    Domain: domain.Image
  });

  var ImagesManager = {
    fetch: function(id, callback) {
      Image.load(id, callback);
    },

    create: function(attributes, callback) {
      Image.create(attributes, callback);
    },

    destroy: function(id, callback) {
      Image.destroy(id, callback);
    }
  };

  return ImagesManager;
};

