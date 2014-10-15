var angular = require('angular');
var morph = require('morph');

angular.module('epsonreceipts.support')
.filter('titlecase', function() {
  return morph.toTitle;
});

angular.module('epsonreceipts.support')
.filter('humancase', function() {
  return morph.toHuman;
});
