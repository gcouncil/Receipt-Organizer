var angular = require('angular');

angular.module('epsonreceipts.items-toolbar', [
  'epsonreceipts.items.items-collection-scope',
  'epsonreceipts.support',
  'selectize'
]);

require('../items/items-collection-scope');
require('./category-filter');
require('./date-filter');
require('./filter-reset');
require('./items-toolbar-directive');
require('./delete-button');
require('./folder-button');
require('./update-report');
