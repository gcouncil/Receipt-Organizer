var _ = require('lodash');
var async = require('async');
var morph = require('morph');
var Boom = require('boom');
var Item = require('epson-receipts/domain/item');
var Field = require('epson-receipts/domain/field');
var sql = require('sql');

var WHITELIST = [
  'id',
  'receipt',
  'type',
  'fields',
  'image',
  'folders',
  'reviewed',
].concat(_.pluck(Field.FIELD_DEFINITIONS, 'name'));

var COLUMNS = [
  'id',
  'type',
  'fields',
  'receipt',
  'folders',
  'reviewed',
  'createdAt',
  'updatedAt',
  'user'
];

module.exports = function(connection) {

  function load(row) {
    return Item.load(row);
  }

  function dump(object) {
    var row = _.pick(object, COLUMNS);

    row.fields = JSON.stringify(_.indexBy(object.fields, 'name'));

    return _.omit(row, _.isUndefined);
  }

  function insert(object, callback) {
    var row = dump(object);
    var query = table
    .insert(row)
    .returning(table.id)
    .toQuery();

    connection.query(query, function(err, results) {
      if (err) { return callback(err); }
      if (results.rows.length > 0) { return authorize(results.rows[0].id, object.user, callback); }

      callback(Boom.notFound());
    });
  }

  function persist(object, callback) {
    var row = dump(object);

    if (!object.id) { return insert(object, callback); }

    var query = table
    .where(table.id.equals(row.id))
    .update(_.omit(row, 'id'))
    .returning(table.id)
    .toQuery();

    connection.query(query, function(err, results) {
      if (err) { return callback(err); }
      if (results.rows.length > 0) { return authorize(results.rows[0].id, object.user, callback); }

      insert(object, callback);
    });
  }

  function fetch(query, callback) {
    connection.query(query, function(err, results) {
      if (err) { return callback(err); }

      var objects = _.map(results.rows, load);
      callback(null, objects);
    });
  }

  function authorize(id, user, callback) {
    var query = table
    .where(table.id.equals(id))
    .toQuery();

    fetch(query, function(err, objects) {
      if (objects.length < 1) { return callback(Boom.notFound()); }
      var object = objects[0];
      if (object.user !== user) { return callback(Boom.forbidden()); }
      callback(null, object);
    });
  }

  function destroy(id, callback) {
    var query = table.delete(table.id.equals(id)).toQuery();
    connection.query(query, callback);
  }

  var table = sql.define({
    name: 'items',
    columns: _.map(COLUMNS, function(column) {
      return { name: morph.toSnake(column), property: column };
    })
  });

  var ItemsManager = {
    query: function(options, callback) {
      var query = table
      .where(table.user.equals(options.user))
      .order(table.fields.pathText('{date,value}').descending(), table.createdAt.desc)
      .toQuery();

      fetch(query, callback);
    },

    create: function(attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);
      var attrs = _.extend(attributes, { user: options.user });

      // TODO(hsk): Only for backwards compatibility, we should try and clean
      // things up so we don't need this
      attrs.type = attrs.type || 'receipt';

      var object = Item.load(attrs);

      persist(object, callback);
    },

    update: function(id, attributes, options, callback) {
      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(object, callback) {
          object.set(attributes);
          persist(object, callback);
        }
      ], callback);
    },

    destroy: function(id, options, callback) {
      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(object, callback) {
          destroy(id, callback);
        }
      ], callback);
    },

    deleteFolders: function(id, options, callback) {
      var query = table
      .where(table.folders.contains(id))
      .toQuery();

      query(query, function(err, objects) {
        if (err) { return callback(err); }

        async.eachLimit(objects, 4, function(object, callback) {
          object.removeFolder(id);
          persist(object, callback);
        }, callback);
      });
    }
  };

  return ItemsManager;
};
