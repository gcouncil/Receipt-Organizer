var domain = require('epson-receipts/domain');
var morph = require('morph');
var async = require('async');
var bcrypt = require('bcrypt');
var _ = require('lodash');

module.exports = function(Bookshelf) {
  var User = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'users',
    Domain: domain.User,
    omit: ['password']
  });

  var UsersManager = {
    create: function(attributes, callback) {
      var user = new domain.User(attributes);
      var dbUser = User.fromDomain(user);

      async.series([
        function encryptPassword(callback) {
          if (user.password) {
            bcrypt.hash(user.password, 10, function(err, passwordHash) {
              if (err) { return callback(err); }
              dbUser.set('passwordHash', passwordHash);
              callback(null);
            });
          } else {
            callback(null);
          }
        },

        function saveRecord(callback) {
          dbUser.save().exec(callback);
        }
      ], function(err, results) {
        if (err) { return callback(err); }
        callback(null, results[0].toDomain());
      });

    },

    authenticate: function(email, password, callback) {
      User.forge({ email: email }).fetch().exec(function(err, result) {
        if (err) { return callback(err); }

        bcrypt.compare(password, result.attributes.password_hash, function(err, match) {
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
