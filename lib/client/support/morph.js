var angular = require('angular');
var morph = require('morph');

angular.module('epsonreceipts')
.filter('titlecase', function() {
  return morph.toTitle;
});

angular.module('epsonreceipts')
.filter('humancase', function() {
  return morph.toHuman;
});
