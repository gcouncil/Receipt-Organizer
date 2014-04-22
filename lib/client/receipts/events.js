var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts').run(function(
  $rootScope,
  $q,
  domain,
  receiptEditor,
  receiptStorage,
  imageStorage,
  confirmation,
  notify
) {
  $rootScope.$on('receipts:edit', function($event, receipts) {
    receiptEditor(receipts);
  });

  $rootScope.$on('receipts:destroy', function($event, receipts) {
    receipts = _.isArray(receipts) ? receipts.slice() : [receipts];

    var count = receipts.length;
    if (count < 1) { return; }

    confirmation({
      count: count,
      when: {
        one: 'Are you sure you want to delete this receipt?',
        other: 'Are you sure you want to delete these {} receipts?'
      },
      yes: 'Delete',
      no: 'Cancel'
    }).then(function() {
      _.each(receipts, _.bindKey(receiptStorage, 'destroy'));
    });
  });

  $rootScope.$on('receipts:new', function(event) {
    var receipt = new domain.Receipt({});
    receiptEditor(receipt);
  });

  $rootScope.$on('receipts:newimages', function(event, blobs) {
    console.log('newimages', arguments);

    blobs = _.filter(blobs, function(blob) {
      return blob.type === 'image/jpeg' || blob.type === 'image/png';
    });

    if(blobs.length < 1) { return; }

    var promises = _.map(blobs, function(blob) {
      return imageStorage.create(blob).then(function(image) {
        return receiptStorage.create({
          image: image.id
        });
      });
    });

    $q.all(promises).then(function() {
      notify.success(blobs.length + ' Image(s) added');
    }, function() {
      notify.error('Error while importing images');
    });
  });

});
