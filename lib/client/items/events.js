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
  notify,
  uuid,
  erPluralize
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

  $rootScope.$on('items:recognize', function(event, receipts) {
    _.each(receipts, function(receipt) {
      itemStorage.recognize(receipt.id);
    });
  });

  // ITEMS:DESTROY HELPER FUNCTIONS

  // Build a custom delete message depending on:
  // 1. Whether the selection has any items that are contained in reports
  // 2. Whether the selection has any dependent expenses

  function buildDeleteMessage(itemsLength, reportsLength, hasChildren) {
    var customMessage = [];
    if (reportsLength > 0) {
      customMessage = ['The selected'];
      customMessage.push(erPluralize('item', itemsLength));
      customMessage.push(erPluralize('is', itemsLength));
      customMessage.push('contained in');
      customMessage.push(reportsLength);
      customMessage.push(erPluralize('report', reportsLength) + '.');
    }

    if (hasChildren) {
      customMessage.push( 'The selected');
      customMessage.push(erPluralize('item', itemsLength));
      customMessage.push(erPluralize('has', itemsLength));
      customMessage.push('split expenses.');
      customMessage.push('These will also be deleted if you continue.');
    }
    customMessage = customMessage.join(' ');
    return customMessage;
  }

  // Given a collection of items and a collection of reports,
  // go through the array of item ids in each report
  // and remove any ids that are present in the items collection

  function removeItemsFromReports(items, reports) {
    // Collect the item ids
    var itemIds = _.pluck(items, 'id');

    // Remove the item ids from each report's items array
    _.each(reports, function(report) {
      report.items = _.difference(report.items, itemIds);
    });

    return reports;
  }

  // Given a collection of items with children, a collection of reports,
  // a flag for whether the user has selected any receipts that have
  // dependent expenses,
  // and a count of the initially selected items,
  // Pop a confirmation dialog with a custom message appropriate to the state
  // of the selection.
  //
  // On confirmation acceptance:
  // 1. Remove the items from the reports
  // 2. Sort the items to be deleted so that the children will be deleted first
  // 3. Update the reports in the database
  // 4. Delete the items from the database

  function confirmAndPersistDelete(items, reports, hasChildren, initialItemsLength) {
    var message = buildDeleteMessage(initialItemsLength, reports.length, hasChildren);
    confirmation({
      count: items.length,
      when: {
        one: 'Are you sure you want to delete this item?',
        other: 'Are you sure you want to delete these {} items?'
      },
      yes: 'Delete',
      no: 'Cancel',
      custom: message
    }).then(function() {
      reports = removeItemsFromReports(items, reports);
      items = _.sortBy(items, function(item) {
        return item.type !== 'expense';
      });
      _.each(reports, _.bindKey(reportStorage, 'update'));
      _.each(items, _.bindKey(itemStorage, 'destroy'));
    });
  }

  $rootScope.$on('items:destroy', function($event, items) {
    // Make sure that the items are in array form
    items = _.isArray(items) ? items.slice() : [items];

    // Return if there are no items
    var itemsCount = items.length;
    if (itemsCount < 1) { return; }

    // If there are any receipts,
    // go get their dependent child expenses
    // and add them to the items array
    // so they will be deleted too.

    var fetchChildrenPromises = [];
    var hasChildren = false;

    _.each(items, function(item) {
      if (item.type === 'receipt') {
        fetchChildrenPromises.push(itemStorage.fetchChildren(item.id).then(function(children) {
          if (children.length > 0) {
            hasChildren = true;
          }
          items = items.concat(children);
        }));
      }
    });

    // When we have all the child expenses in the items collection,
    // remove any duplicates from that collection,
    // then fetch all the reports that contain any of the items.

    $q.all(fetchChildrenPromises).then(function(results) {
      items = _.uniq(items);

      var reports = [];
      var promises = [];
      _.each(items, function(item) {
        promises.push(reportStorage.findAllWithItem(item.id).then(function(found) {
          reports = reports.concat(found);
        }));
      });

      // When we have all the reports that contain the items to be deleted,
      // build up the delete confirmation message,
      // prompt the user for confirmation,
      // and persist the changes to the database.

      $q.all(promises).then(function() {
        confirmAndPersistDelete(items, reports, hasChildren, itemsCount);
      });
    });
  });
});

