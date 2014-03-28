var angular = require('angular');

angular.module('epsonreceipts.layout').factory('flashManager', function() {
  return {
    messages: [],
    addMessage: function(message, type) {
      this.messages.push({ text: message, type: type });
    },
    clearMessages: function() {
      this.messages = [];
    }
  };
});


angular.module('epsonreceipts.layout').directive('flash', function() {
  return {
    restrict: 'E',
    template: require('./flash.html'),
    controller: function($scope, flashManager) {
      $scope.$watch(function() {
        return flashManager.messages;
      }, function(messages) {
        $scope.messages = messages;
      });
    }
  };
});
