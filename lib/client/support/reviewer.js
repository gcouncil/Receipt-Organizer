var _ = require('lodash');

function Reviewer() {
  this.allItems = [];
  //this.unreviewed = {};
  this.unreviewedItems = [];
}

_.extend(Reviewer.prototype, {
  set: function(attributes) {
    _.extend(this, _.pick(attributes, ['allItems']));
    this._update();
  },

  hasUnreviewed: function() {
    return this.unreviewedItems.length > 0;
  },

  unreviewedTally: function() {
    return this.unreviewedItems.length;
  },

  _update: function() {
    this.unreviewedItems = _.filter(this.allItems, function(receipt) { return !receipt.reviewed; } );
  }
});

module.exports = Reviewer;
