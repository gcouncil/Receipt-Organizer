var _ = require('lodash');

function Selection() {
  this.visibleItems = [];
  this.selected = {};
  this.selectedItems = [];
}

_.extend(Selection.prototype, {
  set: function(attributes) {
    _.extend(this, _.pick(attributes, ['visibleItems']));
    this._update();
  },

  hasSelection: function() {
    return this.selectedItems.length > 0;
  },

  isFullySelected: function() {
    return this.selectedItems.length === this.visibleItems.length;
  },

  isPartiallySelected: function() {
    return this.hasSelection() && !this.isFullySelected();
  },

  isSelected: function(id) {
    return this.selected[id];
  },

  toggleSelection: function(id, value) {
    console.log(id, this.selected[id]);
    this.selected[id] = _.isUndefined(value) ? !this.selected[id] : value;
    this._update();
  },

  toggleFullSelection: function() {
    var self = this;

    if (this.selectedItems.length > 0) {
      _.each(this.selectedItems, function(item) {
        self.selected[item.id] = false;
      });
    } else {
      _.each(this.visibleItems, function(item) {
        self.selected[item.id] = true;
      });
    }

    this._update();
  },

  _update: function() {
    var self = this;

    this.selectedItems = _.filter(this.visibleItems, function(receipt) {
      return self.selected[receipt.id];
    });
  }
});

module.exports = Selection;
