var angular = require('angular');

angular.module('epsonreceipts.users', [
  'epsonreceipts.users.signup',
  'epsonreceipts.users.login',
  'epsonreceipts.users.logout',
  'epsonreceipts.users.settings'
]);

require('./signup');
require('./login');
require('./logout');
require('./settings');