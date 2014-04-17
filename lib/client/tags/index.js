var angular = require('angular');

angular.module('epsonreceipts.tags', [
  'epsonreceipts.tags.new-tag',
  'epsonreceipts.tags.tag-organizer',
  'epsonreceipts.tags.tag-actions'
]);

require('./new-tag');
require('./tag-organizer');
require('./tag-actions');

