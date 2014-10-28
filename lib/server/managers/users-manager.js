var domain = require('epson-receipts/domain');
var async = require('async');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var Boom = require('boom');
var _ = require('lodash');

module.exports = function(repository, mailer) {
  var UsersManager = {};

  function validateUniqueness(user, callback) {
    repository.tryByEmail(user.email, function(err, user) {
      if (err) { return callback(err); }
      if (user) {
        return callback(Boom.create(422, 'A user with that email already exists!'));
      }
      callback(null);
    });
  };

  function encryptPassword(user, callback) {
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
  };

  function generateToken(user, callback) {
    crypto.randomBytes(48, function(err, result) {
      if (err) { return callback(err); }
      var token = result.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      user.token = token;
      callback(null);
    });
  };

  UsersManager.create = function(attributes, callback) {
    var user = new domain.User(attributes);

    async.series([
      async.apply(validateUniqueness, user),

      async.apply(encryptPassword, user),

      async.apply(generateToken, user),

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

  UsersManager.update = function(user, data, callback) {
    async.series([
      // Update the password (if one is provided)
      function(callback) {
        if (data.password) {
          user.password = data.password;
          async.series([
            async.apply(encryptPassword, user),
            async.apply(generateToken, user),
          ], callback);
        } else {
          callback(null);
        }
      },

      // Update the email (if it has changed)
      function(callback) {
        if (user.email !== data.email) {
          // validate the email
          user.email = data.email;
          validateUniqueness(user, function(err) {
            if (err) { return callback(err); }
            callback(null);
          });
        } else {
          callback(null);
        }
      }
    ], function(err, results) {
      if (err) { return callback(err); }
      repository.save(user, callback);
    })
  };

  return UsersManager;
};
