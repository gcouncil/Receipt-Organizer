var domain = require('epson-receipts/domain');
var async = require('async');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var Boom = require('boom');
var _ = require('lodash');

module.exports = function(Bookshelf) {
  var User = Bookshelf.Domain.extend({
    hasTimestamps: ['createdAt', 'updatedAt'],
    tableName: 'users',
    Domain: domain.User
  });

  var UsersManager = {
    create: function(attributes, callback) {
      var user = new domain.User(attributes);

      async.series([
        function validateUniqueness(callback) {
          User.collection().query().count('*').limit(1).where({ email: user.email }).exec(function(err, result) {
            if (err) { return callback(err); }

            if (result[0].count > 0) {
              return callback(Boom.create(422, 'A user with that email already exists!'));
            } else {
              return callback();
            }
          });
        },

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

        function generateToken(callback) {
          crypto.randomBytes(48, function(err, result) {
            if (err) { return callback(err); }
            var token = result.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            user.token = token;
            callback(null);
          });
        },

        function saveRecord(callback) {
          User.persist(user, { isNew: true }, callback);
        }
      ], function(err, results) {
        if (err) { return callback(err); }

        callback(null, _.last(results));
      });

    },

    authenticate: function(email, password, callback) {
      return User.forge({ email: email }).fetch().exec(function(err, result) {
        if (err) { return callback(err); }

        function badEmailOrPassword() {
          return callback(null, false);
        }

        if (!result) {
          return badEmailOrPassword();
        }

        bcrypt.compare(password, result.toDomain().passwordHash, function(err, match) {
          if (err) { return callback(err); }

          if (match) {
            return callback(null, result.toDomain());
          } else {
            return badEmailOrPassword();
          }
        });
      });

    },

    verifyToken: function(token, callback) {
      return User.forge({ token: token }).fetch().exec(function(err, user) {
        if (err) { return callback(err); }
        if (!user) { return callback(null, false); }
        return callback(null, user.toDomain());
      });
    }
  };
  return UsersManager;
};
