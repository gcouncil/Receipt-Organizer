var async = require('async');

module.exports = function(managers, workers) {
  managers.folders.on('destroy', function(id, callback) {
    managers.items.deleteFolders(id, {}, callback);
  });

  managers.items.on('create', function(id, callback) {
    async.waterfall([
      function(callback) {
        managers.items.fetch(id, { user: true }, callback);
      },
      function(item, callback) {
        if (item.type === 'receipt' && item.image) {
          workers.push('formxtra', { receipt: item.id }, callback);
        } else {
          callback();
        }
      }
    ], callback);
  });
};
