var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.items').run(function(
  $rootScope,
  $q,
  domain,
  receiptEditor,
  reportEditor,
  itemStorage,
  imageStorage,
  reportStorage,
  confirmation,
  notify
) {
  $rootScope.$on('items:edit', function($event, items) {
    receiptEditor(items);
  });

  $rootScope.$on('items:destroy', function($event, items) {
    items = _.isArray(items) ? items.slice() : [items];

    var count = items.length;
    if (count < 1) { return; }

    confirmation({
      count: count,
      when: {
        one: 'Are you sure you want to delete this item?',
        other: 'Are you sure you want to delete these {} items?'
      },
      yes: 'Delete',
      no: 'Cancel'
    }).then(function() {
      _.each(items, _.bindKey(itemStorage, 'destroy'));
    });
  });

  $rootScope.$on('items:new', function(event) {
    var item = new domain.Receipt({});
    receiptEditor(item);
  });

  $rootScope.$on('items:newimages', function(event, blobs) {
    blobs = _.filter(blobs, function(blob) {
      return blob.type === 'image/jpeg' || blob.type === 'image/png';
    });

    if(blobs.length < 1) { return; }

    var promises = _.map(blobs, function(blob) {
      return imageStorage.create(blob).then(function(image) {
        var item = new domain.Receipt({ image: image.id });
        return itemStorage.create(item);
      });
    });

    $q.all(promises).then(function() {
      notify.success(blobs.length + ' Image(s) added');
    }, function() {
      notify.error('Error while importing images');
    });
  });

  $rootScope.$on('items:reviewed', function(event, items) {
    _.each(items, function(item) {
      if( item.reviewed ) { return; }
      item.reviewed = true;
      itemStorage.persist(item);
    });
  });

  $rootScope.$on('items:recognize', function(event, receipts) {
    _.each(receipts, function(receipt) {
      itemStorage.recognize(receipt.id);
    });
  });

  $rootScope.$on('items:newReport', function(event, items) {
    var report = new domain.Report({ name: 'New Report' });
    reportEditor(report, items);
  });

  $rootScope.$on('items:editReport', function(event, report) {
    reportEditor(report);
  });
});
