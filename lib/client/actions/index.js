var angular = require('angular');

angular.module('epsonreceipts.actions', [
  'epsonreceipts.storage',
  'epsonreceipts.support'
]);

require('./delete-item-action');

require('../storage');
require('../support');
