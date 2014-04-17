var $ = require('jquery');
var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('tableDataField', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $element) {
      // Add a target for focus to enable tabbing between fields
      $element.prepend('<a href="#" class="placeholder focus-hack"></a>');
      var $input = $element.find('input, textarea, select, .form-control');

      var children = _.groupBy($element.find('*'), function(child) {
        return $(child).hasClass('placeholder') ? 'placeholders' : 'inputs';
      });

      function update(focus, event) {
        if ($input.hasClass('ng-invalid')) {
          focus = true;
          $element.toggleClass('has-error', true);
        } else {
          $element.toggleClass('has-error', false);
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
        if ($(event.target).is('.focus-hack')) {
          $input.focus();
        }
      });

      $element.on('blur', '*', function() {
        update(false);
      });

    }
  };
});
