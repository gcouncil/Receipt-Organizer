var angular = require('angular');

angular.module('epsonreceipts.tags', [
  'epsonreceipts.tags.new-tag',
  'epsonreceipts.tags.tag-organizer'
]);

require('./new-tag');
require('./tag-organizer');

