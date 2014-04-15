var angular = require('angular');
var _ = require('lodash');

angular.element.event.props.push('dataTransfer');

angular.module('epsonreceipts.images').directive('imageDropZone', function(imageStorage, receiptStorage, $q, flashManager) {
  return {
    restrict: 'EA',
    link: function($scope, $element, $attributes) {

      function checkItem(item) {
        console.log(item);
        return item.type === 'image/jpeg';
      }

      function checkTypes(dataTransfer) {
        console.log(dataTransfer, dataTransfer.files);
        var typesMatch = _.contains(dataTransfer.types, 'image/jpeg') || _.contains(dataTransfer.types, 'Files');
        var filesMatch = _.any(dataTransfer.files, checkItem);
        var itemsMatch = _.any(dataTransfer.items, checkItem);

        return typesMatch || filesMatch || itemsMatch;
      }

      $element.on('dragenter dragover', function(event) {
        if (checkTypes(event.dataTransfer)) {
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();
          return false;
        }
      });

      $element.on('dragleave', function(event) {
      });

      $element.on('drop', function(event) {
        var items, files;
        if (event.dataTransfer.items) {
          items = _.filter(event.dataTransfer.items || [], checkItem);
          files = _.map(items, function(item) { return item.getAsFile(); });
        } else {
          files = event.dataTransfer.files;
        }

        if (files.length > 0) {
          console.log('prevent default drop');
          event.preventDefault();
        }

        var promises = _.map(files, function(file) {
          if (!file) { return; }

          return imageStorage.create(file).then(function(image) {
            return receiptStorage.create({
              image: image.id
            });
          });
        });

        $q.all(promises).then(function(receipts) {
          flashManager.addMessage('Created ' + receipts.length + ' new receipts', 'success');
        }, function(error) {
          flashManager.addMessage('An error occurred while adding receipts', 'danger');
        });
      });
    }
  };
});
