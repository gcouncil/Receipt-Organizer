var angular = require('angular');

angular.module('epsonreceipts.widgets').filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
