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

require('./image-loader-controller');
