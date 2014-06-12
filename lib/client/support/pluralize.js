var angular = require('angular');
var _ = require('lodash');

var PLURALIZATIONS = {
  'is': 'are',
  'has': 'have'
};

angular.module('epsonreceipts.support').service('erPluralize', function() {
  return function(string, count) {
    var output;

    if (_.has(PLURALIZATIONS, string)) {
      output = count > 1 ? PLURALIZATIONS[string] : string;
    } else if (count === 1) {
      output = string;
    } else {
      output = string + 's';
    }

    return output;
  };
});

