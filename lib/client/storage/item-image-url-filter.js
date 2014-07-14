var angular = require('angular');

angular.module('epsonreceipts.storage').filter('itemImageUrl', function(
  imageStorage
) {
  return function(item, index) {
    return imageStorage.imgSrc(item && item.images && item.images[index || 0]);
  };
});
