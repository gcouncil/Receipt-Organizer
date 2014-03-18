var angular = require('angular');
var _ = require('lodash');

var Datastore = require('./lib/datastore');
var ReceiptManager = require('./lib/receipt-manager');
var ReceiptQuery = require('./lib/receipt-query');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('storage', function() {
  return {
    connect: function($scope) {
      return new Datastore();
    }
  };
});

angular.module('epsonreceipts.storage').factory('receiptStorage', function() {
  return {
    query: function($scope, datastore, options) {
      return new ReceiptQuery(datastore, options);
    },

    create: function($scope, datastore, attributes) {
      new ReceiptManager(datastore).create(attributes);
    }
  };
});
