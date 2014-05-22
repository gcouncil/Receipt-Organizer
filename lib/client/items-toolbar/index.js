var angular = require('angular');

angular.module('epsonreceipts.items-toolbar', [
  'epsonreceipts.items.items-collection-scope',
  'epsonreceipts.support'
]);

require('./category-filter-input-directive');
require('./date-filter-input-directive');
require('./filter-reset-directive');
require('./items-toolbar-directive');
require('./items-toolbar-folder-button-directive');

require('../items/items-collection-scope');
require('./items-toolbar-update-report-button-directive');
