var angular = require('angular');
var moment = require('moment');
require('ui-utils');
require('ui-bootstrap');
require('ui-bootstrap-tpls');

angular.module('epsonreceipts', ['ui.bootstrap', 'epsonreceipts.widgets', 'epsonreceipts.storage']);

require('./components/widgets');
require('./components/storage');

angular.module('epsonreceipts').controller('InboxController', function($scope, receiptStorage) {
  receiptStorage.query({ scope: $scope }, function(receipts) {
    $scope.receipts = receipts;
  });
});
