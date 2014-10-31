var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.items').run(function(
  $rootScope,
  $q,
  domain,
  receiptEditor,
  itemStorage,
  imageStorage,
  confirmation,
  notify,
  uuid,
  deleteItem
) {
  $rootScope.$on('items:edit', function($event, items) {
    receiptEditor(items);
  });

  $rootScope.$on('items:review', function(event, items) {
    _.each(items, function(item) {
      itemStorage.markReviewed(item);
    });
  });

  $rootScope.$on('items:new', function(event) {
    uuid().then(function(id) {
      var item = new domain.Receipt({
        id: id,
        formxtraStatus: 'skipped'
      });
      receiptEditor(item);
    });
  });

  $rootScope.$on('items:newimages', function(event, blobs) {
    blobs = _.filter(blobs, function(blob) {
      return blob.type === 'image/jpeg' || blob.type === 'image/png';
    });

    if(blobs.length < 1) { return; }

    var promises = _.map(blobs, function(blob) {
      return imageStorage.create(blob).then(function(image) {
        var item = new domain.Receipt({ images: [image.id] });
        return itemStorage.create(item);
      });
    });

    $q.all(promises).then(function() {
      notify.success(blobs.length + ' Image(s) added');
    }, function() {
      notify.error('Error while importing images');
    });
  });

  $rootScope.$on('items:recognize', function(event, receipts) {
    _.each(receipts, function(receipt) {
      itemStorage.recognize(receipt.id);
    });
  });

  function confirmItemsDelete(count, messages) {
    return confirmation({
      count: count,
      when: {
        one: 'Are you sure you want to delete this item?',
        other: 'Are you sure you want to delete these {} items?'
      },
      yes: 'Delete',
      no: 'Cancel',
      custom: messages
    });
  }

  $rootScope.$on('items:destroy', function($event, items) {
    // Make sure that the items are in array form
    items = _.isArray(items) ? items.slice() : [items];

    var plan;
    // Ask the Delete Item Action to calculate the item delete logic
    deleteItem.prepareItemsDelete(items).then(function(_plan) {
      plan = _plan;
      // Ask the Delete Item Action to build custom messages depending on the
      // state upon item delete.
      var messages = deleteItem.buildDeleteMessages(plan.count, plan.reports.length, plan.hasChildren);

      // Confirm delete with the user
      return confirmItemsDelete(plan.count, messages);
    }).then(function() {
      // Persist changes
      deleteItem.executeItemsDelete(plan);
    });
  });

  $rootScope.$on('items:removeFromFolder', function($event, items, folder) {
    // Make sure that the items are in array form
    items = _.isArray(items) ? items.slice() : [items];

    var deferreds = [];

    if (folder && folder !== 'unreviewed') {
      items.forEach(function(item) {
        item.removeFolder(folder);
        deferreds.push(itemStorage.update(item));
      });
    }

    return $q.all(deferreds);
  });
});

