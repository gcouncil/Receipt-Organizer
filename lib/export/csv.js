var _ = require('lodash');
var moment = require('moment');
var csv = require('csv-write-stream');

module.exports = function(report, items, options, callback) {
  var csvItems = buildCSVItemList(items);
  var csvHeaders = buildCSVHeaders(csvItems[0]);
  var csvWriter = csv({headers: csvHeaders});
  
  callback(null, csvWriter);
  
  _.each(csvItems, function(csvItem){
    csvWriter.write(csvItem);
  });

  csvWriter.end();
};


function buildCSVHeaders(item){
  // add in nice Names
  var headers = _.keys(item);
  return headers;
}

function buildCSVItemList(items){
  return _.map(items, function(item){
    return buildCSVItem(item);        
  });
}

function buildCSVItem(item){
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
    'comments',
    'user1',
    'user2',
    'user3',
    'user4',
    'user5'
  ]);

  // if(item.user1 || item.user2 || item.user3 || item.user4 || item.user5){
  //   debugger;
  // }

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
