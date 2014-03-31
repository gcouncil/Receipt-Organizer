var domain = require('epson-receipts/domain');
var morph = require('morph');
var _ = require('lodash');



module.exports = function(Bookshelf) {

  var Image = Bookshelf.Model.extend({
    hasTimestamps: true,
    tableName: 'images',

    toDomain: function() {
      var attributes = morph.toCamel(this.attributes);
      return new domain.Image(attributes);
    }
  }, {
    fromAttributes: function(attributes) {
      var image = new domain.Image(attributes);
      return this.fromDomain(image);
    },

    fromDomain: function(image) {
      var attributes = morph.toSnake(image.toJSON());
      if (!attributes.id) { delete attributes.id; }
      return new this(attributes);
    }
  });

  var ImagesManager = {
    query: function(options, callback) {
      Image.collection().query('orderBy', 'created_at').fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        callback(null, results.map(function(image) {
          var attrs = morph.toCamel(image.attributes);
          return new domain.Image(attrs);
        }));
      });
    },

    fetch: function(uuid, callback) {
      Image.forge({ uuid: uuid }).fetch().exec(function(err, result) {
        if (err) { return callback(err); }

        var image = new domain.Image(morph.toCamel(result.attributes));
        callback(null, image);
      });
    },

    create: function(attributes, callback) {
      var image = new domain.Image(attributes);

      var attrs = _.omit(morph.toSnake(image.toJSON()), ['id']);

      Image.forge(attrs).save().exec(function(err, result) {
        if (err) { return callback(err); }

        image = new domain.Image(morph.toCamel(result.attributes));
        callback(null, image);
      });
    },

    destroy: function(id, callback) {
      Image.forge({ id: id }).destroy().exec(callback);
    }
  };

  return ImagesManager;
};

