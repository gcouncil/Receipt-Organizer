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

      function update(focus) {
        if (ngModelController.$invalid) {
          focus = true;
        }

        $(children.placeholders).toggle(!focus);
        $(children.inputs).toggle(focus);
      }

      update(false);

      $element.on('click', function() {
        update(true);
        $input.focus();
      });

      $element.on('focus', '*', function() {
        update(true);
        if (event.target === focusHack[0]) {
          $input.focus();
        }
      });

      $element.on('blur', '*', function() {
        update(false);
      });

    }
  };
});
