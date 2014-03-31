var angular = require('angular');

angular.module('epsonreceipts.users', [
  'epsonreceipts.users.signup-form',
  'epsonreceipts.users.login-form'
]);

require('./signup');
require('./login');
