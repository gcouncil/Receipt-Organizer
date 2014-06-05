#! /usr/local/bin/node

var Api = require('epson-receipts/server/api');
var domain = require('epson-receipts/domain');
var ld = require('lodash');

var a = new Api();
var user = process.argv[2] || process.env['epsonUserId'];
if (!user) {
  throw new Error('must supply a user id!');
}
var count = process.argv[3] || 4;

ld.times(count, function(i) {
  a.repositories.items.save(new domain.Receipt({
    formxtraStatus: 'skipped',
    vendor: 'Quick Left ' + i,
    reviewed: false,
    user: user,
    total: 100 + i
  }), function() {
    console.log('saved item ' + i);
    if (i === 3) {
      process.exit();
    }
  });
});

