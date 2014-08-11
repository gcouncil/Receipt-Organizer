var angular = require('angular');
var domain = require('epson-receipts/domain');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('domain', function() { return domain; });

require('./storage-events-service');
require('./user-storage');
require('./folder-storage');
require('./item-storage');
require('./image-storage');
require('./report-storage');
require('./session-storage');

require('./current-user-service');

require('./item-image-url-filter');
require('./load-image-directive');

angular.module('epsonreceipts.storage').run(function(
  currentUser,
  storageEvents,
  imageStorage,
  itemStorage
) {
  storageEvents.on('online', function() {
    var user = currentUser.get();

    return itemStorage.load(true, !(user && user.token))
    .then(function() {
      return imageStorage.sync();
    })
    .then(function() {
      return itemStorage.sync();
    });
  });

  storageEvents.on('offline', function() {
    itemStorage.load(true, false);
  });
});
