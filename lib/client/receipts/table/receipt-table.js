var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts.table').directive('receiptTable', function() {
  return {
    restrict: 'E',
    template: require('./receipt-table.html'),
    scope: {
      receipts: '=',
      datastore: '='
    },
    controller: function($scope, receiptEditor, receiptStorage) {

      var selected = $scope.selected = [];

      $scope.updateSelection = function($event, id) {
	var checkedBoolean = $event.target.checked;
	var receiptId = id;
	if (checkedBoolean) {
	    selected.push(id);
	}
	if (!checkedBoolean) {
	  _.remove(selected, function(num) { return num == id; });
	}
      };

      $scope.deleteSelection = function() {
	if (selected.length < 1) {
	  alert("No receipts were selected")
	} else {
	  var receipts = _.filter($scope.receipts, function(receipt) {
	    return _.include(selected, receipt.id)
	  });
	  console.log(receipts)
	}
      };

      $scope.isSelected = function(id) {
	//console.log(id)
      };

//      var updateSelected = function(action, id) {
//	if (action === 'add' && $scope.selected.indexOf(id) === -1) {
//	  $scope.selected.push(id);
//	}
//	if (action === 'remove' && $scope.selected.indexOf(id) !== -1) {
//	  $scope.selected.splice($scope.selected.indexOf(id), 1);
//	}
//      };

//      $scope.updateSelection = function($event, id) {
//	var checkbox = $event.target;
//	var action = (checkbox.checked ? 'add' : 'remove');
//	updateSelected(action, id);
//      };

//      $scope.getSelectedClass = function(entity) {
//	return $scope.isSelected(entity.id) ? 'selected' : '';
//      };

//      $scope.isSelected = function(id) {
//	return $scope.selected.indexOf(id) >= 0;
//      };

//      $scope.isSelectedAll = function() {
//	return $scope.selected.length === $scope.entities.length;
//      };

//      $scope.edit = function(receipt) {
//        var modal = receiptEditor.open(receipt);
//        modal.result.then(function(receipt) {
//          receiptStorage.update(receipt);
//        });
//      };

//      $scope.destroy = function(receipt) {
//        receiptStorage.destroy(receipt);
//      };
    }
  };
});
