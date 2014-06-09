var angular = require('angular');

angular.module('epsonreceipts.users', [
  'epsonreceipts.users.signup',
  'epsonreceipts.users.login',
  'epsonreceipts.users.settings',
  'epsonreceipts.users.user-dropdown-menu'
]);

require('./signup');
require('./login');
require('./settings');
require('./user-dropdown-menu');
