var _ = require('lodash');
var angular = require('angular');
var Selectize = require('selectize');
require('jquery-ui/core');
require('jquery-ui/position');

angular.module('selectize', []).directive('selectize', function(
  $timeout,
  $parse
) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function($scope, $element, $attributes, ngModelController) {
      var selectize, cancelValueWatch;

      $scope.$watch($attributes.selectizeSettings, function(settings) {
        if (selectize) { selectize.destroy(); selectize = undefined; }
        if (cancelValueWatch) { cancelValueWatch(); cancelValueWatch = undefined; }

        _.defaults(settings, Selectize.defaults);

        selectize = new Selectize($element, settings);

        selectize.on('dropdown_open', function($dropdown) {
          $dropdown.zIndex( $element.next().zIndex() + 10 );
        });

        $scope.$watch($attributes.selectizeOptions, function(updated, original) {
          _.each(_.difference(updated, original), selectize.addOption, selectize);
          _.each(_.difference(original, updated), selectize.removeOption, selectize);
          ngModelController.$render();
        }, true);

        // Used to prevent a call to $setViewValue that would otherwise be
        // triggered by the call to setValue in render
        var rendering = false;
        ngModelController.$render = function() {
          var values = ngModelController.$viewValue;

          $timeout(function() {
            rendering = true;
            selectize.setValue(values);
            selectize.refreshItems();
            rendering = false;
          }, false);
        };

        $element.off('change');
        selectize.on('change', function() {
          if (rendering) { return; }
          $scope.$apply(function() {
            ngModelController.$setViewValue(selectize.getValue());
          });
        });

        ngModelController.$render();
      }, true);
    }
  };
});
