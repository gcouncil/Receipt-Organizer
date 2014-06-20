var domain = require('epson-receipts/domain');
var async = require('async');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var Boom = require('boom');
var _ = require('lodash');

module.exports = function(repository, mailer) {
  var UsersManager = {};

  UsersManager.create = function(attributes, callback) {
    var user = new domain.User(attributes);

    async.series([
      function validateUniqueness(callback) {
        repository.tryByEmail(user.email, function(err, user) {
          if (err) { return callback(err); }
          if (user) {
            return callback(Boom.create(422, 'A user with that email already exists!'));
          }
          callback();
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
        repository.save(user, callback);
      }
    ], function(err, results) {
      if (err) { return callback(err); }

      callback(null, _.last(results));
    });
  };

  UsersManager.authenticate = function(email, password, callback) {
    var ctx = {};

    async.waterfall([
      function(callback) {
        repository.tryByEmail(email, callback);
      },
      function(user, callback) {
        if (!user) { return callback(null, false); }
        ctx.user = user;

        bcrypt.compare(password, user.passwordHash, callback);
      },
      function(match, callback) {
        if (match) {
          return callback(null, ctx.user);
        } else {
          return callback(null, false);
        }
      }
    ], callback);
  };

  UsersManager.verifyToken = function(token, callback) {
    return repository.tryByToken(token, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      return callback(null, user);
    });
  };

  UsersManager.updateSettings = function(user, settings, callback) {
    user.settings = settings;
    repository.save(user, callback);
  };

  return UsersManager;
};
