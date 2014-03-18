var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('receiptThumbnail', function() {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail.html'),
    scope: {
      receipt: '='
    }
  };
});

