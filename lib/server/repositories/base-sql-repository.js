var _ = require('lodash');
var async = require('async');
var boom = require('boom');
var morph = require('morph');
var sql = require('sql');

function BaseSqlRepository(connection, events) {
  this.connection = connection;
  this.events = events;
}

BaseSqlRepository.configureTable = function(tableName, columnNames) {
  this.prototype.namespace = tableName;
  this.prototype.columns = columnNames;
  this.prototype.table = sql.define({
    name: tableName,
    columns: _.map(columnNames, function(column) {
      return { property: column, name: morph.toSnake(column) };
    })
  });
};

BaseSqlRepository.prototype.parse = function(row) {
  var data = _.transform(row, function(data, value, key) {
    data[morph.toCamel(key)] = value;
  });

  return this.loadObject(data);
};

BaseSqlRepository.prototype.format = function(object) {
  var data = _.pick(object.toJSON(), this.columns);

  return _.omit(data, _.isUndefined);
};

BaseSqlRepository.prototype._scopes = function(object) {
  if (object.user) {
    return ['user:' + object.user];
  } else {
    return [];
  }
};

BaseSqlRepository.prototype._query = function(query, callback) {
  this.connection.query(query, callback);
};

BaseSqlRepository.prototype._upsert = function(row, callback) {
  var self = this;

  async.waterfall([
    function(callback) {
      if(row.id) { return self._update(row, callback); }
      else { return callback(null, null); }
    },
    function(id, callback) {
      if (id) { return callback(null, id); }

      self._insert(row, callback);
    },
    function(id, callback) {
      if (!id) { return new Error('Failed to upsert record!'); }

      self.load(id, callback);
    }
  ], callback);
};

BaseSqlRepository.prototype._insert = function(row, callback) {
  var self = this;

  var data = _.extend({
    createdAt: self.table.literal('current_timestamp'),
    updatedAt: self.table.literal('current_timestamp')
  }, row);

  var query = self.table
  .insert(data)
  .returning(self.table.star())
  .toQuery();

  self._query(query, function(err, results) {
    if (err) { return callback(err); }

    if (results.rows[0].id) {
      self._emit('created', self.parse(results.rows[0]), done);
    } else {
      done();
    }

    function done(err) {
      callback(err, results.rows[0].id);
    }
  });
};

BaseSqlRepository.prototype._update = function(row, callback) {
  var self = this;

  var data = _.extend({
    updatedAt: self.table.literal('current_timestamp')
  }, row);

  if (!data.id) {
    return callback(boom.notFound());
  }

  var query = self.table
  .where(self.table.id.equals(data.id))
  .update(_.omit(data, 'id'))
  .returning(self.table.star())
  .toQuery();

  self._query(query, function(err, results) {
    if (err) { return callback(err); }

    if (results.rows[0].id) {
      self._emit('updated', self.parse(results.rows[0]), done);
    } else {
      done();
    }

    function done(err) {
      callback(err, results.rows[0].id);
    }
  });
};

BaseSqlRepository.prototype._emit = function(name, object, callback) {
  if (!this.events) { return callback(); }
  this.events.emit({
    name: this.namespace + ':' + name,
    data: {
      id: object.id,
      type: this.namespace,
      action: name
    },
    scopes: this._scopes(object)
  }, callback);
};

BaseSqlRepository.prototype.query = function(query, callback) {
  var self = this;

  async.waterfall([
    function(callback) {
      self._query(query, callback);
    },
    function(result, callback) {
      callback(null, _.map(result.rows, self.parse, self));
    }
  ], callback);
};

BaseSqlRepository.prototype.queryOne = function(query, callback) {
  var self = this;

  async.waterfall([
    function(callback) {
      self.query(query, callback);
    },
    function(objects, callback) {
      if (objects.length > 1) {
        return callback(new Error('Multiple results'));
      }

      if (objects.length < 1) {
        return callback(boom.notFound());
      }

      callback(null, objects[0]);
    }
  ], callback);
};

BaseSqlRepository.prototype.load = function(id, callback) {
  var self = this;

  var query = self.table
  .where(self.table.id.equals(id))
  .toQuery();

  self.queryOne(query, callback);
};

BaseSqlRepository.prototype.save = function(object, callback) {
  var self = this;

  self._upsert(self.format(object), callback);
};

BaseSqlRepository.prototype.destroy = function(object, callback) {
  var self = this;

  var query = self.table
  .delete()
  .where(self.table.id.equals(object.id))
  .toQuery();

  async.series([
    function(callback) {
      self._query(query, callback);
    },
    function(callback) {
      self._emit('destroyed', object, callback);
    }
  ], callback);
};

BaseSqlRepository.prototype.process = function(id, fn, callback) {
  var self = this;

  async.waterfall([
    _.bindKey(self, 'load', id),
    fn,
    _.bindKey(self, 'save')
  ], callback);
};

module.exports = BaseSqlRepository;
