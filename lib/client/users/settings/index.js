var angular = require('angular');
angular.module('epsonreceipts.users.settings', [
  'ui.router'
]);

require('./user-settings-directive');
require('./account-settings');
require('./category-settings');
require('./form-field-settings');
