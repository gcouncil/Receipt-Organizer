module.exports = function(managers) {
  managers.tags.on('destroy', function(id, callback) {
    managers.expenses.deleteTags(id, {}, callback);
  });
};
