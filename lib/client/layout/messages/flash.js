var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.layout').factory('flashManager', function($rootScope) {
  return {
    messages: [],
    addMessage: function(message, type, angular) {
      this.clearMessages();
      this.setTimeout();
      this.messages.push({ text: message, type: type });
    },
    clearMessages: function() {
      this.messages = [];
      this.clearTimeout();
    },
    setTimeout: function() {
      var self = this;
      this.clearTimeout();
      this._timeout = setTimeout(function() {
        $rootScope.$apply(_.bind(self.clearMessages, self));
      }, 30e3);
    },
    clearTimeout: function() {
      if(this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = undefined;
      }
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
