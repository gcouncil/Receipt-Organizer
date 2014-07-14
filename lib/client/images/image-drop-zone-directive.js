var _ = require('lodash');
var $ = require('jquery');
var angular = require('angular');

angular.element.event.props.push('dataTransfer');

angular.module('epsonreceipts.images').directive('imageDropZone', function(
  imageStorage,
  itemStorage,
  notify,
  $q
) {
  return {
    restrict: 'EA',
    link: function($scope, $element, $attrs) {

      function checkItem(item) {
        return item.type === 'image/jpeg' || item.type === 'image/png';
      }

      function checkTypes(dataTransfer) {
        var typesMatch = _.contains(dataTransfer.types || [], 'image/jpeg') || _.contains(dataTransfer.types || [], 'image/png');
        var filesMatch = _.any(dataTransfer.files || [], checkItem);
        var itemsMatch = _.any(dataTransfer.items || [], checkItem);

        return typesMatch || filesMatch || itemsMatch;
      }

      var $overlay = $('<div class="dnd-overlay"><h1>Drop Images Here</h1></div>').appendTo('body');
      $overlay.hide();

      $scope.$on('$destroy', function() {
        $overlay.remove();
      });

      $element.on('dragover', function(event) {
        event.dataTransfer.dropEffect = checkTypes(event.dataTransfer) ? 'copy' : 'none';

        var scrollParent = $element.scrollParent();
        var rect = $element[0].getBoundingClientRect();

        if (!$overlay.is(':visible') && _.contains(event.dataTransfer.types, 'Files')) {
          $overlay.show();
          $overlay.zIndex($element.zIndex() + 10);
          $overlay.css({
            top: rect.top + scrollParent.scrollTop(),
            left: rect.left + scrollParent.scrollLeft(),
            width: rect.width,
            height: rect.height
          });
        }

        event.stopPropagation();
        event.preventDefault();
        return false;
      });

      $overlay.on('dragover dragenter', function(event) {
        event.stopPropagation();
        event.preventDefault();
      });

      $overlay.on('dragleave', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $overlay.hide();
      });

      $overlay.on('drop', function(event) {
        var items, files;

        event.stopPropagation();
        event.preventDefault();

        $overlay.hide();

        if (event.dataTransfer.items) {
          items = _.filter(event.dataTransfer.items || [], checkItem);
          files = _.map(items, function(item) { return item.getAsFile(); });
        } else {
          files = _.filter(event.dataTransfer.files || [], checkItem);
        }

        if (files.length <= 0) {
          alert('Only jpeg and png images can be uploaded');
          return;
        }

        var promises = _.map(files, function(file) {
          if (!file) { return; }

          return imageStorage.create(file);
        });

        if ($attrs.dropHandler) {
          $q.all(promises).then(function(images) {
            $scope.$eval($attrs.dropHandler, { $images: images });
          });
        } else {
          promises = _.map(promises, function(promise) {
            return promise.then(function(image) {
              itemStorage.create({
                images: [image.id]
              });
            });
          });
          $q.all(promises).then(function(items) {
            notify.success('Created ' + items.length + ' new items');
          }, function(error) {
            notify.error('An error occurred while adding items');
          });
        }

        return false;
      });
    }
  };
});
