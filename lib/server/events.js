module.exports = function(managers) {
  managers.folders.on('destroy', function(id, callback) {
    managers.expenses.deleteFolders(id, {}, callback);
  });
};
