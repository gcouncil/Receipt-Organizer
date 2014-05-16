var async = require('async');

module.exports = function(events, managers, workers) {
  events.on('folders:destroy', function(id, callback) {
    managers.items.deleteFolders(id, {}, callback);
  });

  events.on('items:created', function(id, callback) {
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
