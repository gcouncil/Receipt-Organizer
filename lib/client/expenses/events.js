var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.expenses').run(function(
  $rootScope,
  $q,
  domain,
  receiptEditor,
  itemStorage,
  imageStorage,
  confirmation,
  notify
) {
  $rootScope.$on('items:edit', function($event, expenses) {
    receiptEditor(expenses);
  });

  $rootScope.$on('items:destroy', function($event, expenses) {
    expenses = _.isArray(expenses) ? expenses.slice() : [expenses];

    var count = expenses.length;
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
      _.each(expenses, _.bindKey(itemStorage, 'destroy'));
    });
  });

  $rootScope.$on('items:new', function(event) {
    var expense = new domain.Receipt({});
    receiptEditor(expense);
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

  $rootScope.$on('items:reviewed', function(event, expenses) {
    _.each(expenses, function(expense) {
      if( expense.reviewed ) { return; }
      expense.reviewed = true;
      itemStorage.persist(expense);
    });
  });

});
