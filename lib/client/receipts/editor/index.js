var angular = require('angular');
require('ui-bootstrap');
require('ui-utils');

angular.module('epsonreceipts.receipts.editor', ['ui.bootstrap', 'ui.keypress']);

require('./receipt-editor');
require('./receipt-form');
