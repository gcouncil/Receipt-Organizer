var angular = require('angular');
var _ = require('lodash');

angular.element.event.props.push('dataTransfer');

angular.module('epsonreceipts.images').directive('imageDropZone', function(
  imageStorage,
  expenseStorage,
  notify,
  $q
) {
  return {
    restrict: 'EA',
    link: function($scope, $element, $attributes) {

      function checkItem(item) {
        return item.type === 'image/jpeg';
      }

      function checkTypes(dataTransfer) {
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

      $element.on('drop', function(event) {
        var items, files;
        if (event.dataTransfer.items) {
          items = _.filter(event.dataTransfer.items || [], checkItem);
          files = _.map(items, function(item) { return item.getAsFile(); });
        } else {
          files = event.dataTransfer.files;
        }

        if (files.length <= 0) { return; }

        event.preventDefault();

        var promises = _.map(files, function(file) {
          if (!file) { return; }

          return imageStorage.create(file).then(function(image) {
            return expenseStorage.create({
              image: image.id
            });
          });
        });

        $q.all(promises).then(function(expenses) {
          notify.success('Created ' + expenses.length + ' new expenses');
        }, function(error) {
          notify.error('An error occurred while adding expenses');
        });
      });
    }
  };
});
