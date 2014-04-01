var domain = require('epson-receipts/domain');

module.exports = function(Bookshelf) {
  var Image = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'images',
    Domain: domain.Image
  });

  var ImagesManager = {
    fetch: function(id, callback) {
      Image.forge({ id: id }).fetch().exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, result.toDomain());
      });
    },

    create: function(attributes, callback) {
      Image.create(attributes).exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, result.toDomain());
      });
    },

    destroy: function(id, callback) {
      Image.forge({ id: id }).destroy().exec(callback);
    }
  };

  return ImagesManager;
};

