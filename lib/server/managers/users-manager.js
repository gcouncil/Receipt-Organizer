var domain = require('epson-receipts/domain');
var morph = require('morph');
var _ = require('lodash');

module.exports = function(Bookshelf) {
  var User = Bookshelf.model.extend({
    hasTimestamps: true,
    tableName: 'users'
  });

  var UsersManager = {
    create: function(attributes, callback) {
      var user = new domain.User(attributes);

      var attrs = _.omit(morph.toSnake(user.toJSON()), 'id');

      User.forge(attrs).save().exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, morph.toCamel(user));
      });
    }
  };
  return UsersManager;
};
