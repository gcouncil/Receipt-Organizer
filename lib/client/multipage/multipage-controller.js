var _ = require('lodash');
var angular = require('angular');
var Receipt = require('epson-receipts/domain/receipt');
require('jquery-ui/sortable');

angular.module('epsonreceipts.multipage').controller('MultipageController', function(
  $scope,
  $q,
  itemStorage,
  imageStorage,
  twain,
  deferred
) {
  $scope.item = new Receipt();

  $scope.scan = function() {
    twain.scan(function(image) {
      $scope.item.images.push(image.id);
    });
  };

  $scope.import = function() {
    var promises = _.map($scope.files, function(file) {
      if(!_.contains(['image/jpeg', 'image/png'], file.type)) {
        console.warn('Tried to import a file that is not a jpeg or png file');
        return;
      }

      return imageStorage.create(file);
    });

    $q.all(promises).then(function(images) {
      [].push.apply($scope.item.images, _.map(images, 'id'));
    });
  };

  $scope.drop = function(images) {
    [].push.apply($scope.item.images, _.map(images, 'id'));
  };

  $scope.remove = function(i) {
    $scope.item.images.splice(i, 1);
  };

  $scope.save = function() {
    if ($scope.item.images.length > 0) {
      itemStorage.create($scope.item);
    }

    deferred.resolve();
  };
});
