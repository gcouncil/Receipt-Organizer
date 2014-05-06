var domain = require('epson-receipts/domain');

var _ = require('lodash');
var async = require('async');
var Boom = require('boom');

var WHITELIST = [
  'id',
  'date',
  'vendor',
  'paymentType',
  'category',
  'city',
  'state',
  'tax',
  'additionalTax',
  'total',
  'tip',
  'taxCategory',
  'businessPurpose',
  'reimbursable',
  'billable',
  'comments',
  'image',
  'tags',
  'reviewed'
];

module.exports = function(Bookshelf) {

  var Expense = Bookshelf.Domain.extend({
    hasTimestamps: ['createdAt', 'updatedAt'],
    tableName: 'expenses',
    Domain: domain.Expense
  });

  var authorize = function(id, user, callback) {
    Expense.load(id, function(err, expense) {
      if (err) { return callback(err); }
      if (!expense) { return callback(Boom.notFound()); }

      if (expense.user !== user) {
        return callback(Boom.forbidden());
      } else {
        return callback(null, expense);
      }
    });
  };

  var ExpensesManager = {
    query: function(options, callback) {
      Expense.collection().query(function(query) {
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

      Expense.create(attrs, function(err, expense) {
        if (err) { callback(err); }
        callback(null, expense);
      });
    },

    update: function(id, attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);

      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(expense, callback) {
          expense.set(attributes);
          Expense.persist(expense, { isNew: false }, callback);
        }
      ], callback);
    },

    destroy: function(id, options, callback) {
      async.series([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(callback) {
          Expense.destroy(id, callback);
        }
      ], callback);
    },

    deleteTags: function(id, options, callback) {
      Expense.collection().query(function(query) {
        query.whereRaw('tags @> ?', [[id]]);
      })
      .fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        async.each(results, function(expense, callback) {
          expense = expense.toDomain();
          expense.removeTag(id);
          Expense.persist(expense, { isNew: false }, callback);
        }, callback);
      });
    }
  };

  return ExpensesManager;
};
