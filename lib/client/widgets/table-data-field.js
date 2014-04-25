var $ = require('jquery');
var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('tableDataField', function() {
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

      function update() {
        var focus = ngModelController.$invalid || $element.is(':focus') || focusHack.is(':focus');

        $(children.placeholders).toggle(!focus);
        $(children.inputs).toggle(focus);
      }

      $scope.$watch(function() {
        return ngModelController.$invalid;
      }, update);

      $element.on('click', function() {
        update();
        $input.focus();
      });

      $element.on('focus', '*', function() {
        update();
        if (event.target === focusHack[0]) {
          $input.focus();
        }
      });

      $element.on('blur', '*', function() {
        update();
      });

    }
  };
});
