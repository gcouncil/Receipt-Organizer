var angular = require('angular');
var domain = require('epson-receipts/domain');

angular.module('epsonreceipts.storage', ['epsonreceipts.support']);

angular.module('epsonreceipts.storage').factory('domain', function() { return domain; });

require('./storage-events-service');
require('./user-storage');
require('./folder-storage');
require('./item-storage');
require('./image-storage');
require('./report-storage');
require('./session-storage');
require('./offline-storage');

require('./current-user-service');

require('./item-image-url-filter');
require('./load-image-directive');

angular.module('epsonreceipts.storage').run(function(
  $timeout,
  currentUser,
  storageEvents,
  imageStorage,
  itemStorage,
  folderStorage,
  userStorage,
  reportStorage,
  $q
) {
  $timeout(function() {
    itemStorage.load();
    imageStorage.load();
  }, 0);

  storageEvents.on('online', function(options) {
    var user = currentUser.get();

    if (!options.sync) {
      return $q.defer().resolve();
    }

    return itemStorage.load(true, !(user && user.token))
      .then(function() {
        return imageStorage.sync();
      })
      .then(function() {
        return itemStorage.sync();
      })
      .then(function() {
        return folderStorage.sync();
      })
      .then(function() {
        return userStorage.sync();
      })
      .then(function() {
        return reportStorage.sync()
          .then(function() {
            return reportStorage.load();
          });
      });
  });

  storageEvents.on('offline', function() {
    itemStorage.load(true, false);
    imageStorage.load();
    reportStorage.load(true, true);
  });
});
