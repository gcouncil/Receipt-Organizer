var angular = require('angular');
var domain = require('epson-receipts/domain');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('domain', function() { return domain; });

require('./basic-storage');
require('./current-user-service');
require('./expense-storage');
require('./image-storage');
require('./session-storage');
require('./tag-storage');
require('./user-storage');

require('./image-loader-controller');
