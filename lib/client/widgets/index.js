var angular = require('angular');

angular.module('epsonreceipts.widgets', [
  'ui.utils',
  'mgcrea.ngStrap.datepicker'
]);

require('./bulk-selection');
require('./confirmation-input');
require('./currency-input');
require('./datepicker-directive');
require('./draggable-item-directive');
require('./file-input');
require('./form-group');
require('./is-selected');
require('./item-folders-input');
require('./table-data-field');
