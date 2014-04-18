var angular = require('angular');

angular.module('epsonreceipts.tags', [
  'epsonreceipts.tags.new-tag',
  'epsonreceipts.tags.tag-organizer',
  'epsonreceipts.tags.tag-actions',
  'epsonreceipts.tags.drop-target'
]);

require('./new-tag');
require('./drop-target');
require('./tag-organizer');
require('./tag-actions');

