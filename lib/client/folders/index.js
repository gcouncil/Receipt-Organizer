var angular = require('angular');

angular.module('epsonreceipts.folders', [
  'mgcrea.ngStrap.dropdown',
  'mgcrea.ngStrap.select',
  'epsonreceipts.folders.new-folder',
  'epsonreceipts.folders.folder-organizer',
  'epsonreceipts.folders.review-folder-tab'
]);

require('./folder-service');
require('./new-folder');
require('./folder-organizer');
require('./review-folder');

