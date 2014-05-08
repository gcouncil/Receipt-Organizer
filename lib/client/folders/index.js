var angular = require('angular');

angular.module('epsonreceipts.folders', [
  'mgcrea.ngStrap.dropdown',
  'mgcrea.ngStrap.select',
  'epsonreceipts.folders.new-folder',
  'epsonreceipts.folders.folder-organizer',
  'epsonreceipts.folders.folder-actions',
  'epsonreceipts.folders.drop-zone'
]);

require('./new-folder');
require('./folder-drop-zone');
require('./folder-organizer');
require('./folder-actions');

