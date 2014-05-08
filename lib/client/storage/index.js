var angular = require('angular');
var domain = require('epson-receipts/domain');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('domain', function() { return domain; });

require('./user-storage');
require('./folder-storage');
require('./expense-storage');
require('./image-storage');
require('./session-storage');

require('./current-user-service');

require('./image-loader-controller');
