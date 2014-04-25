var angular = require('angular');

angular.module('epsonreceipts.widgets', [
  'ui.utils',
  'mgcrea.ngStrap.datepicker'
]);

require('./form-confirm-leave');
require('./form-auto-save');
require('./bulk-selection');
require('./is-selected');
require('./page-nav');
require('./form-group');
require('./file-input');
require('./currency-input');
require('./confirmation-input');
require('./receipt-tags-input');
require('./table-data-field');
require('./datepicker-directive');
