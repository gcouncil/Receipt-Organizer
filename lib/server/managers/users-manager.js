var domain = require('epson-receipts/domain');
var async = require('async');
var bcrypt = require('bcrypt');
var Boom = require('boom');
var _ = require('lodash');

module.exports = function(Bookshelf) {
  var User = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'users',
    Domain: domain.User
  });

  var UsersManager = {
    create: function(attributes, callback) {
      var user = new domain.User(attributes);

      async.series([
        function encryptPassword(callback) {
          if (user.password) {
            bcrypt.hash(user.password, 10, function(err, passwordHash) {
              if (err) { return callback(err); }
              user.passwordHash = passwordHash;
              user.password = undefined;
              callback(null);
            });
          } else {
            callback(null);
          }
        },

        function validateUniqueness(callback) {
          User.collection().query().count('*').limit(1).where({ email: user.email }).exec(function(err, result) {
            if (err) { return callback(err); }

            if (result[0].count > 0) {
              callback(Boom.create(422, 'A user with that email already exists!'));
            }

            callback();
          });
        },

        function saveRecord(callback) {
          User.create(user).exec(callback);
        }
      ], function(err, results) {
        if (err) { return callback(err); }
        callback(null, _.last(results).toDomain());
      });

    },

    authenticate: function(email, password, callback) {
      User.forge({ email: email }).fetch().exec(function(err, result) {
        if (err) { return callback(err); }

        bcrypt.compare(password, result.toDomain().passwordHash, function(err, match) {
          if (err) { return callback(err); }

          if (match) {
            callback(null, result.toDomain());
          } else {
            return callback(null, false, {message: 'Failed to log in. Please check your credentials and try again.'});
          }
        });
      });

    }
  };
  return UsersManager;
};
