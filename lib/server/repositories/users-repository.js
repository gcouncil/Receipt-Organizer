var _ = require('lodash');
var util = require('util');
var BaseSqlRepository = require('./base-sql-repository');
var User = require('epson-receipts/domain/user');

util.inherits(UsersRepository, BaseSqlRepository);
_.extend(UsersRepository, BaseSqlRepository);

function UsersRepository(connection, events) {
  BaseSqlRepository.call(this, connection, events);
}

UsersRepository.configureTable('users', [
  'id',
  'email',
  'passwordHash',
  'token',
  'settings',
  'createdAt',
  'updatedAt'
]);

UsersRepository.prototype._scopes = function(object) {
  return ['user:' + object.id];
};

UsersRepository.prototype.loadObject = function(data) {
  return new User(data);
};

UsersRepository.prototype.format = function(object) {
  var row = BaseSqlRepository.prototype.format.call(this, object);

  row.settings = JSON.stringify('settings');

  return _.omit(row, _.isUndefined);
};

UsersRepository.prototype.tryByEmail = function(email, callback) {
  var query = this.table
  .where(this.table.email.equals(email))
  .limit(1)
  .toQuery();

  this.tryQueryOne(query, callback);
};

UsersRepository.prototype.tryByToken = function(token, callback) {
  var query = this.table
  .where(this.table.token.equals(token))
  .limit(1)
  .toQuery();

  this.tryQueryOne(query, callback);
};

module.exports = UsersRepository;
