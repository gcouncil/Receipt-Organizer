var domain = require('epson-receipts/domain');
var _ = require('lodash');
var async = require('async');
var Boom = require('boom');

var WHITELIST = [
  'id',
  'name',
  'items'
];

module.exports = function(Bookshelf) {

  var Report = Bookshelf.Domain.extend({
    hasTimestamps: ['createdAt', 'updatedAt'],
    tableName: 'reports',
    Domain: domain.Report,

  format: function(attributes) {
      return Bookshelf.Domain.prototype.format.call(this, attributes);
    }
  });

  var authorize = function(id, user, callback) {
    Report.load(id, function(err, report) {
      if (err) { return callback(err); }
      if (!report) { return callback(Boom.notFound()); }

      if (report.user !== user) {
        return callback(Boom.forbidden());
      } else {
        return callback(null, report);
      }
    });
  };

  var ReportsManager = {
    query: function(options, callback) {
      Report.collection().query(function(query) {
        query.orderBy('created_at', 'DESC').where({ user: options.user });
      })
      .fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        callback(null, results.invoke('toDomain'));
      });
    },

    create: function(attributes, options, callback) {

      attributes = _.pick(attributes, WHITELIST);
      var attrs = _.extend(attributes, { user: options.user });

      Report.create(attrs, function(err, report) {
        if (err) { callback(err); }
        callback(null, report);
      });
    },

    update: function(id, attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);

      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(report, callback) {
          report.set(attributes);
          Report.persist(report, { isNew: false }, callback);
        }
      ], callback);
    },

    destroy: function(id, options, callback) {
      async.series([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(callback) {
          Report.destroy(id, callback);
        }
      ], callback);
    },

    deleteItems: function(id, options, callback) {
      Report.collection().query(function(query) {
        query.whereRaw('items @> ?', [[id]]);
      })
      .fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        async.each(results, function(report, callback) {
          report = report.toDomain();
          report.removeItem(id);
          Report.persist(report, { isNew: false }, callback);
        }, callback);
      });
    }
  };

  return ReportsManager;
};


