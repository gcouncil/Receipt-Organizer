var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.actions').factory('deleteItem', function(
  $q,
  reportStorage,
  itemStorage,
  erPluralize
) {

  // Given a collection of items and a collection of reports,
  // go through the array of item ids in each report
  // and remove any ids that are present in the items collection

  function removeItemsFromReports(items, reports) {
    var itemIds = _.pluck(items, 'id');

    _.each(reports, function(report) {
      report.items = _.difference(report.items, itemIds);
    });

    return reports;
  }

  function prepareItemsDelete(items) {
    var itemsCount = items.length;
    if (itemsCount < 1) { return; }

    // Fetch child expenses of receipts so that they will be deleted too.
    var childrenPromises = _.map(items, function(item) {
      return itemStorage.fetchChildren(item.id);
    });

    // Build an array of the initial items and fetched children,
    // then fetch all the reports that contain any of them.
    var children;
    return $q.all(childrenPromises).then(function(results) {
      children = _.flatten(results, true);
      items = _.uniq(items.concat(children), 'id');

      var reportPromises = _.map(items, function(item) {
        return reportStorage.findAllWithItem(item.id);
      });

      return $q.all(reportPromises);
    }).then(function(reports) {
      reports = _(reports).flatten(true).uniq('id').valueOf();

      // Return the initial items count,
      // collection of items and children,
      // asscociated reports,
      // and a flag marking whether children were fetched.
      return {
        count: itemsCount,
        items: items,
        reports: reports,
        hasChildren: !!children.length
      };
    });
  }

  // To persist item delete:
  // 1. Remove the item ids from the reports
  // 2. Sort the items to be deleted so that the children will be deleted first
  // 3. Update the reports in the database
  // 4. Delete the items from the database

  function executeItemsDelete(plan) {
    var reports = removeItemsFromReports(plan.items, plan.reports);
    var items = _.sortBy(plan.items, function(item) {
      return item.type !== 'expense';
    });

    _.each(reports, _.bindKey(reportStorage, 'update'));
    _.each(items, _.bindKey(itemStorage, 'destroy'));
  }

  // Build a custom delete message depending on:
  // 1. Whether the selection has any items that are contained in reports
  // 2. Whether the selection has any dependent expenses

  function buildDeleteMessages(itemsLength, reportsLength, hasChildren) {
    var customMessages = [];
    if (reportsLength > 0) {
      customMessages.push([
        'The selected',
        erPluralize('item', itemsLength),
        erPluralize('is', itemsLength),
        'contained in',
        reportsLength,
        erPluralize('report', reportsLength) + '.'
      ].join(' '));
    }

    if (hasChildren) {
      customMessages.push([
        'The selected',
        erPluralize('item', itemsLength),
        erPluralize('has', itemsLength),
        'split expenses.',
        'These will also be deleted if you continue.'
      ].join(' '));
    }

    return customMessages;
  }

  return {
    buildDeleteMessages: buildDeleteMessages,
    prepareItemsDelete: prepareItemsDelete,
    executeItemsDelete: executeItemsDelete
  };
});

