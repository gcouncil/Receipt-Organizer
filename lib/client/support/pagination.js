var _ = require('lodash');

function Pagination() {
  this.allItems = [];
  this.pageItems = [];
  this.total = 0;
  this.offset = 0;
  this.limit = 10;
}

_.extend(Pagination.prototype, {
  set: function(attributes) {
    _.extend(this, _.pick(attributes, ['allItems', 'total', 'offset', 'limit']));
    this._update();
  },

  first: function() {
    return this.offset + 1;
  },

  last: function() {
    return Math.min(this.offset + this.limit, this.total);
  },

  page: function() {
    return Math.floor(this.offset / this.limit);
  },

  previousPage: function() {
    this.offset = Math.max(this.offset - this.limit, 0);
    this._update();
  },

  nextPage: function() {
    this.offset = Math.min(this.offset + this.limit, this.total);
    this._update();
  },

  hasPrevious: function() {
    return this.offset > 0;
  },

  hasNext: function() {
    return this.last() < this.total;
  },

  gotoPage: function(page) {
    this.offset = page * this.limit;
    this._update();
  },

  _update: function() {
    this.pageItems = this.allItems.slice(this.offset, this.offset + this.limit);
  }
});

module.exports = Pagination;
