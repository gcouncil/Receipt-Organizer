var angular = require('angular');
var domain = require('epson-receipts/domain');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('domain', function() { return domain; });

require('./user-storage');
require('./receipt-storage');
require('./image-storage');
