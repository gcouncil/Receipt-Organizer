var morph = require('morph');

module.exports = function(config) {
  var Bookshelf = require('bookshelf').initialize({
    client: 'pg',
    connection: {
      database: config.database.name
    }
  });

  Bookshelf.Domain = Bookshelf.Model.extend({
    toDomain: function() {
      var attributes = morph.toCamel(this.attributes);
      return new this.Domain(attributes);
    }
  }, {
    fromAttributes: function(attributes) {
      var object = new this.prototype.Domain(attributes);
      return this.fromDomain(object);
    },

    fromDomain: function(object) {
      var attributes = morph.toSnake(object.toJSON());
      if (!attributes.id) { delete attributes.id; }
      return new this(attributes);
    }
  });

  return Bookshelf;
};