var angular = require('angular');

angular.module('epsonreceipts.tags', [
  'mgcrea.ngStrap.dropdown',
  'mgcrea.ngStrap.select',
  'epsonreceipts.tags.new-tag',
  'epsonreceipts.tags.tag-organizer',
  'epsonreceipts.tags.tag-actions',
  'epsonreceipts.tags.drop-zone'
]);

require('./new-tag');
require('./tag-drop-zone');
require('./tag-organizer');
require('./tag-actions');

