var _ = require('lodash');
var async = require('async');
var morph = require('morph');
var Boom = require('boom');

module.exports = function(config) {
  var Bookshelf = require('bookshelf').initialize({
    // debug: true,
    client: 'pg',
    connection: config.database
  });

  Bookshelf.Domain = Bookshelf.Model.extend({
    toDomain: function() {
      return _.isFunction(this.Domain.load) ? this.Domain.load(this.attributes) : new this.Domain(this.attributes);
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
    load: function(id, callback) {
      this.forge({ id: id }).fetch().exec(function(err, result) {
        if (err) { return callback(err); }
        if (!result) { return callback(Boom.notFound()); }

        return callback(null, result.toDomain());
      });
    },

    persist: function(object, options, callback) {
      this.forge({ id: object.id }).save(object.toJSON(), { method: options.isNew ? 'insert' : 'update' }).exec(function(err, result) {
        if (err) { return callback(err); }

        return callback(null, result.toDomain());
      });
    },

    create: function(attributes, callback) {
      var Domain = this.prototype.Domain;
      var object = _.isFunction(Domain.load) ? Domain.load(attributes) : new Domain(attributes);
      this.persist(object, { isNew: true }, callback);
    },

    update: function(id, attributes, callback) {
      var self = this;

      async.waterfall([
        function(callback) {
          self.load(id, callback);
        },
        function(object, callback) {
          object.set(attributes);
          self.persist(object, { isNew: false }, callback);
        }
      ], callback);
    },

    destroy: function(id, callback) {
      this.forge({ id: id }).destroy().exec(function(err, result) {
        if (err) { return callback(err); }

        return callback();
      });

    }
  });

  return Bookshelf;
};
