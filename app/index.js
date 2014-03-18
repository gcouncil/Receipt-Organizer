var angular = require('angular');
var moment = require('moment');
require('ui-bootstrap');
require('ui-bootstrap-tpls');

angular.module('epsonreceipts', ['ui.bootstrap', 'epsonreceipts.widgets', 'epsonreceipts.storage']);

require('./components/widgets');
require('./components/storage');

angular.module('epsonreceipts').run(function($rootScope, storage) {
  $rootScope.datastore = storage.connect($rootScope);
});

angular.module('epsonreceipts').controller('InboxController', function($scope, receiptStorage) {
  $scope.receipts = receiptStorage.query($scope, $scope.datastore, {});
});
