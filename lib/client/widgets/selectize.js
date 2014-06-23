var _ = require('lodash');
var angular = require('angular');
var Selectize = require('selectize');
require('jquery-ui/core');

angular.module('selectize', []).directive('selectize', function(
  $timeout,
  $parse
) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function($scope, $element, $attributes, ngModelController) {
      var selectize, cancelValueWatch;

      $scope.$on('$destroy', function() {
        if (selectize) { selectize.destroy(); selectize = undefined; }
      });

      $scope.$watch($attributes.selectizeSettings, function(settings) {
        if (selectize) { selectize.destroy(); selectize = undefined; }
        if (cancelValueWatch) { cancelValueWatch(); cancelValueWatch = undefined; }

        _.defaults(settings, {
          options: $parse($attributes.selectizeOptions)($scope)
        }, Selectize.defaults);

        selectize = new Selectize($element, settings);

        selectize.on('dropdown_open', function($dropdown) {
          $dropdown.zIndex( $element.next().zIndex() + 10 );
        });

        $attributes.$observe('disabled', function(value) {
          if (value) {
            selectize.disable();
          } else {
            selectize.enable();
          }
        });

        $scope.$watch($attributes.selectizeOptions, function(updated, original) {
          var originalValues = _.map(original, settings.valueField);
          var updatedValues = _.map(updated, settings.valueField);
          var items = _.indexBy(updated, settings.valueField);
          _.each(_.difference(updatedValues, originalValues), function(value) {
            selectize.addOption(items[value]);
          });

          _.each(_.difference(originalValues, updatedValues), function(value) {
            selectize.removeOption(value);
          });

          _.each(_.intersection(originalValues, updatedValues), function(value) {
            selectize.updateOption(value, items[value]);
          });

          selectize.refreshOptions(false);
          ngModelController.$render();
        }, true);

        // Used to prevent a call to $setViewValue that would otherwise be
        // triggered by the call to setValue in render
        var rendering = false;
        ngModelController.$render = function() {
          var values = ngModelController.$viewValue;

          var isBlank = values === null || values === undefined || values === '';
          if (isBlank && selectize.getOption('**undefined**')) {
            values = '**undefined**';
          }

          rendering = true;
          selectize.setValue(values);
          selectize.refreshItems();
          rendering = false;
        };

        $element.off('change');
        selectize.on('change', function() {
          if (rendering) { return; }
          var value = selectize.getValue();
          value = (value === '**undefined**') ? undefined  : value;
          $scope.$apply(function() {
            ngModelController.$setViewValue(value);
          });
        });

        ngModelController.$render();
      }, true);
    }
  };
});
