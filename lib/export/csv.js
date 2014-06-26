var _ = require('lodash');
var moment = require('moment');
var csv = require('csv-write-stream');

module.exports = function(report, items, options, services, callback) {
  var user = services.getUser();
  // build CSV Items
  var csvItems = _.map(items, function(item){
    return buildCSVItem(user.settings.fields, item);
  });

  var csvHeaders = processCSVHeaders(csvItems[0]);
  var csvWriter = csv({headers: csvHeaders});

  callback(null, csvWriter);

  //Write CSV rows
  _.each(csvItems, function(csvItem){
    csvWriter.write(csvItem);
  });

  csvWriter.end();
};


function processCSVHeaders(item){
  // add in nice Names
  var niceName = {
    paymentType: 'Payment Type'
  };

  var headers = _.keys(item);

  return _.map(headers, function(header){
    if(niceName[header]){
      return niceName[header];
    }
    return header;
  });
}

function buildCSVItem(userDefinedFields, item){
  var csvItem = _.pick(item, [
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
    'taxCategory',
    'tip',
    'total',
    'totalRequested',
    'reviewed',
    'city',
    'state',
    'comments'
  ]);

  // add custom fields
  _.each(userDefinedFields, function (field, index) {
    if(field.selected){
      csvItem[field.name] = item['user' + (index + 1)];
    }
  });

  return processCSVItem(csvItem);
}

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

  return csvItem;
}
