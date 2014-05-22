var async = require('async');

module.exports = function(events, managers, workers) {
  events.on('folders:destroy', function(data, callback) {
    managers.items.deleteFolders(data.id, {}, callback);
  });

  events.on('items:created', function(data, callback) {
    async.waterfall([
      function(callback) {
        managers.items.fetch(data.id, { user: true }, callback);
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
