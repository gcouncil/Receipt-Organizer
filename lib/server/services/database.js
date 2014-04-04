var _ = require('lodash');
var morph = require('morph');
var _ = require('lodash');

module.exports = function(config) {
  var Bookshelf = require('bookshelf').initialize({
//    debug: true,
    client: 'pg',
    connection: config.database
  });

  Bookshelf.Domain = Bookshelf.Model.extend({
    toDomain: function() {
      return new this.Domain(this.attributes);
    },

    format: function(attributes) {
      return _.transform(attributes, function(result, value, key) {
        if (_.isUndefined(value)) { return; }

        key = _.map(key.split('.'), function(key) {
          return morph.toSnake(key);
        }).join('.');

        result[key] = value;
      });
    },

    parse: function(response) {
      return _.transform(response, function(result, value, key) {
        key = _.map(key.split('.'), function(key) {
          return morph.toCamel(key);
        }).join('.');

        result[key] = value;
      });
    }
  }, {
    create: function(attributes) {
      var object = new this.prototype.Domain(attributes);
      return this.forge().save(object.toJSON(), { method: 'insert' });
    },

    update: function(id, attributes) {
      var object = new this.prototype.Domain(attributes);
      return this.forge({ id: id }).save(object.toJSON(), { method: 'update', patch: true });
    }
  });

  return Bookshelf;
};
