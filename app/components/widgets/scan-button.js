var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('scanButton', function() {
  return {
    restrict: 'E',
    template: require('./scan-button.html'),
    controller: function($scope, receiptStorage) {
      _.extend($scope, {
        scan: function() {
          alert('Not yet implemented');
        },
        import: function() {
          alert('Not yet implemented');
        },
        create: function() {
          receiptStorage.create($scope, $scope.datastore, {
            date: new Date(),
            total: 42.99,
            type: 'Unknown',
            category: 'None'
          });
        }
      });
    }
  };
});
