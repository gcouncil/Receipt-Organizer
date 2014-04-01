var angular = require('angular');

angular.module('epsonreceipts.layout').factory('flashManager', function($timeout) {
  return {
    messages: [],
    addMessage: function(message, type, angular) {
      var self = this;

      this.clearMessages();
      this.messages.push({ text: message, type: type });
      $timeout(function(){
        self.clearMessages()
      }, 4000);
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
