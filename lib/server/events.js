module.exports = function(managers) {
  managers.tags.on('destroy', function(id, callback) {
    managers.receipts.deleteTags(id, {}, callback);
  });
};
