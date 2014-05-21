module.exports = function(managers) {
  managers.folders.on('destroy', function(id, callback) {
    managers.items.deleteFolders(id, {}, callback);
  });
};
