var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.expenses').run(function(
  $rootScope,
  $q,
  domain,
  receiptEditor,
  expenseStorage,
  imageStorage,
  confirmation,
  notify
) {
  $rootScope.$on('expenses:edit', function($event, expenses) {
    receiptEditor(expenses);
  });

  $rootScope.$on('expenses:destroy', function($event, expenses) {
    expenses = _.isArray(expenses) ? expenses.slice() : [expenses];

    var count = expenses.length;
    if (count < 1) { return; }

    confirmation({
      count: count,
      when: {
        one: 'Are you sure you want to delete this expense?',
        other: 'Are you sure you want to delete these {} expenses?'
      },
      yes: 'Delete',
      no: 'Cancel'
    }).then(function() {
      _.each(expenses, _.bindKey(expenseStorage, 'destroy'));
    });
  });

  $rootScope.$on('expenses:new', function(event) {
    var expense = new domain.Expense({});
    receiptEditor(expense);
  });

  $rootScope.$on('expenses:newimages', function(event, blobs) {
    blobs = _.filter(blobs, function(blob) {
      return blob.type === 'image/jpeg' || blob.type === 'image/png';
    });

    if(blobs.length < 1) { return; }

    var promises = _.map(blobs, function(blob) {
      return imageStorage.create(blob).then(function(image) {
        return expenseStorage.create({
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

  $rootScope.$on('expenses:reviewed', function(event, expenses) {
    _.each(expenses, function(expense) {
      if( expense.reviewed ) { return; }
      expense.reviewed = true;
      expenseStorage.persist(expense);
    });
  });

});
