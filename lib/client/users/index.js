var angular = require('angular');

angular.module('epsonreceipts.users', [
  'epsonreceipts.users.signup-form',
  'epsonreceipts.users.login-form',
  'epsonreceipts.users.logout'
]);

require('./signup');
require('./login');
require('./logout');
