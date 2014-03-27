var domain = require('epson-receipts/domain');
var morph = require('morph');
var async = require('async');
var bcrypt = require('bcrypt');
var _ = require('lodash');

module.exports = function(Bookshelf) {
  var User = Bookshelf.Model.extend({
    hasTimestamps: true,
    tableName: 'users'
  });

  var UsersManager = {
    create: function(attributes, callback) {
      var user = new domain.User(attributes);

      var attrs = _.omit(user.toJSON(), ['id', 'password']);

      async.series([
        function encryptPassword(callback) {
          if (user.password) {
            bcrypt.hash(user.password, 10, function(err, passwordHash) {
              if (err) { return callback(err); }
              attrs.passwordHash = passwordHash;
              callback(null);
            });
          } else {
            callback(null);
          }
        },

        function saveRecord(callback) {
          User.forge(morph.toSnake(attrs)).save().exec(callback);
        }
      ], function(err, results) {
        if (err) { return callback(err); }
        var user = new domain.User(morph.toCamel(_.last(results).attributes));
        callback(null, user);
      });

    }
  };
  return UsersManager;
};
