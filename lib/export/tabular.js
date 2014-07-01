var _ = require('lodash');
var moment = require('moment');
var morph = require('morph');

var BASE_COLUMNS = [
  'name',
  'type',
  'date',
  'billable',
  'reimbursable',
  'paymentType',
  'vendor',
  'tax',
  'category',
  'additionalTax',
  'tip',
  'total',
  'totalRequested',
  'reviewed',
  'city',
  'state',
  'comments',
];

module.exports = function(report, items, options, services) {
  var user = services.getUser();

  var columns = BASE_COLUMNS.slice();
  var headers = _.map(BASE_COLUMNS, morph.toTitle);

  _.each(user.settings.fields, function(field, i) {
    if (field.selected) {
      columns.push('user' + (i + 1));
      headers.push(field.name);
    }
  });

  var rows = [];
  _.each(items, function(item) {
    var data = processCSVItem(_.pick(item, columns));
    rows.push(_.at(data, columns));
  });

  return {
    headers: headers,
    rows: rows
  };
};

function processCSVItem(csvItem){
  var yes = 'Yes';
  // do transforms here
  if(csvItem.date){
    csvItem.date = moment(csvItem.date).format('MM/DD/YYYY');
  }

  if(csvItem.billable){
    csvItem.billable = yes;
  }

  if(csvItem.reimbursable){
    csvItem.reimbursable = yes;
  }

  if(csvItem.reviewed){
    csvItem.reviewed = yes;
  }

  if(csvItem.total) {
    csvItem.total = csvItem.total.toFixed(2);
  }

  _.each(csvItem, function(value, key) {
    if (!value && !_.isNumber(value)) {
      csvItem[key] = '';
    }
  });

  return csvItem;
}

