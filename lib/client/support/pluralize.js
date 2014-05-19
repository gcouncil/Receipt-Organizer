var angular = require('angular');

angular.module('epsonreceipts.support').service('erPluralize', function() {
  return function(string, count) {
    if (count === 1) { return string; }
    return string + 's';
  };
});


