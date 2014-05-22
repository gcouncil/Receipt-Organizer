var _ = require('lodash');
var morph = require('morph');
var async = require('async');
var Boom = require('boom');
var Report = require('epson-receipts/domain/report');
var sql = require('sql');

var WHITELIST = [
  'id',
  'name',
  'items'
];

var COLUMNS = [
  'id',
  'name',
  'items',
  'createdAt',
  'updatedAt',
  'user'
];

module.exports = function(connection) {

  function load(row) {
    row = _.transform(row, function(result, value, key) {
      result[morph.toCamel(key)] = value;
    });

    return Report.load(row);
  }

  function dump(object) {
    var row = _.pick(object, COLUMNS);

    return _.omit(row, _.isUndefined);
  }

  function insert(object, callback) {
    var row = dump(object);
    row.createdAt = row.updatedAt = new Date();
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
    row.updatedAt = new Date();
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
    name: 'reports',
    columns: _.map(COLUMNS, function(column) {
      return { name: morph.toSnake(column), property: column };
    })
  });

  var ReportsManager = {
    query: function(options, callback) {
      var query = table
      .where(table.user.equals(options.user))
      .order(table.createdAt.desc)
      .toQuery();

      fetch(query, callback);
    },

    fetch: function(id, options, callback) {
      authorize(id, options.user, callback);
    },

    create: function(attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);
      var attrs = _.extend(attributes, { user: options.user });

      attrs.name = attrs.name || 'New Report';

      var object = Report.load(attrs);

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

    process: function(id, options, fn, callback) {
      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(object, callback) {
          fn(object, callback);
        },
        persist
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

    deleteItems: function(id, options, callback) {
      var query = table
      .where(table.items.contains(sql.array(id).cast('uuid[]')))
      .toQuery();

      fetch(query, function(err, objects) {
        if (err) { return callback(err); }

        async.eachLimit(objects, 4, function(object, callback) {
          object.removeItem(id);

          persist(object, callback);
        }, callback);
      });
    }
  };

  return ReportsManager;
};


