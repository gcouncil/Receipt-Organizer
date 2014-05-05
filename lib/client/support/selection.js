var _ = require('lodash');

function Selection() {
  // NOTE: Outside of this class these properties should be treated as READ-ONLY.
  // Instead use the various functions (set, toggleSelection, etc.) to update the selection.
  this.visibleItems = [];
  this.selected = {};
  this.selectedItems = [];
}

_.extend(Selection.prototype, {
  // TODO: Convert into a more straight forward setVisibleItems function.
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
