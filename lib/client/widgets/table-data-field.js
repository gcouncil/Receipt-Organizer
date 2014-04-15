var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('tableDataField', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, element) {
      var children = _.groupBy(element.find('*'), function(child) {
        return angular.element(child).hasClass('placeholder') ? 'placeholders' : 'inputs';
      });

      function update(focus) {
        var show = focus ? 'inline' : 'none';
        var noShow = focus ? 'none' : 'inline';
        angular.element(children.placeholders).css({ display: noShow });
        angular.element(children.inputs).css({ display: show });
      }

      update(false);

      element.find('input[type="checkbox"]').css({ display: 'inline' });

      var hack = element.prepend('<a href="#"></a>');

      element.on('click', function() {
        update(true);
        element.find('input')[0].focus();
      });

      element.on('focus', '*', function() {
        update(true);
        element.find('input')[0].focus();
      });

      element.on('blur', '*', function() {
        update(false);
      });

    }
  };
});
