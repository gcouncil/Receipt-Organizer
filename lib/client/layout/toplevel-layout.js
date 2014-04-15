var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.layout').directive('toplevelLayout', function() {
  return {
    restrict: 'E',
    template: require('./toplevel-layout.html'),
    controller: function($scope, domain, authentication, receiptEditor, receiptStorage, imageStorage, flashManager, $q) {
      $scope.$watch(function() {
        return authentication.user;
      }, function(user) {
        $scope.currentUser = user;
      });

      $scope.$on('receipts:new', function(event) {
        var receipt = new domain.Receipt({});

        var modal = receiptEditor.open(receipt);

        modal.result.then(function(receipt) {
          receiptStorage.create(receipt);
        });
      });

      $scope.$on('receipts:newimages', function(event, blobs) {
        blobs = _.filter(blobs, function(blob) {
          return blob.type === 'image/jpeg' || blob.type === 'image/png';
        });

        var promises = _.map(blobs, function(blob) {
          return imageStorage.create(blob).then(function(image) {
            return receiptStorage.create({
              image: image.id
            });
          });
        });

        $q.all(promises).then(function() {
          flashManager.addMessage(blobs.length + ' Image(s) added', 'success');
        }, function() {
          flashManager.addMessage('Error while importing images', 'danger');
        });
      });
    }
  };
});
