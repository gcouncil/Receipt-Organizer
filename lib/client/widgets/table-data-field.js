var $ = require('jquery');
var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('tableDataField', function(
  $timeout
) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $element) {
      // Add a target for focus to enable tabbing between fields
      var focusHack = $('<a href="#" class="placeholder focus-hack"></a>');
      $element.prepend(focusHack);
      var $input = $element.find('input, textarea, select, .form-control');

      var children = _.groupBy($element.find('*'), function(child) {
        return $(child).hasClass('placeholder') ? 'placeholders' : 'inputs';
      });

      var ngModelController = $element.find('*').filter(function() {
        return !!$(this).data('$ngModelController');
      }).data('$ngModelController');

      var focused = false;
      function update() {
        var focus = focused || ngModelController.$invalid;

        $(children.placeholders).toggle(!focus);
        $(children.inputs).toggle(focus);
      }

      $scope.$watch(function() {
        return ngModelController.$invalid;
      }, update);

      $element.on('click', function() {
        focused = true;
        $scope.$apply(update);
        $input.focus();
      });

      $input.on('focus', function() {
        focused = true;
        $scope.$apply(update);
      });

      $input.on('blur', function() {
        focused = false;
        $scope.$apply(update);
      });

      focusHack.on('focus', function() {
        focused = true;
        $scope.$apply(update);
        $input.focus();
      });
    }
  };
});
