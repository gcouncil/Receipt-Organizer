var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('receiptForm', function() {
  return {
    restrict: 'E',
    template: require('./receipt-form.html'),
    scope: {
      receipt: '='
    }
  };
});

