var _ = require('lodash');
var util = require('util');
var BaseSqlRepository = require('./base-sql-repository');
var Folder = require('epson-receipts/domain/folder');

util.inherits(FoldersRepository, BaseSqlRepository);
_.extend(FoldersRepository, BaseSqlRepository);

function FoldersRepository(connection, events) {
  BaseSqlRepository.call(this, connection, events);
}

FoldersRepository.configureTable('folders', [
  'id',
  'name',
  'createdAt',
  'updatedAt',
  'user',
]);

FoldersRepository.prototype.loadObject = function(data) {
  return new Folder(data);
};

FoldersRepository.prototype.search = function(user, params, callback) {
  var query = this.table
  .where(this.table.user.equals(user))
  .order(this.table.name)
  .toQuery();

  this.query(query, callback);
};

module.exports = FoldersRepository;
