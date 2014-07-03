var _ = require('lodash');
var async = require('async');
var path = require('path');
var ContentTypes = require('./content-types');
var Relations = require('./relations');
var ZipStream = require('zip-stream');

function Container() {
  var self = this;

  this.zip = new ZipStream();
  this.queue = async.queue(function(entry, callback) {
    self.zip.entry(entry.content, entry.meta, callback);
  }, 1);

  this.counters = {};
  this.entries = [];

  this.contentTypes = new ContentTypes(this);
  this.rels = new Relations(this, '');

  this.contentTypes.default('rels', 'application/vnd.openxmlformats-package.relationships+xml');
  this.contentTypes.default('xml', 'application/xml');
  this.contentTypes.default('jpg', 'image/jpeg');
  this.contentTypes.default('png', 'image/png');
}

Container.prototype.getUniqueFilename = function(file) {
  var extname = path.extname(file);
  var basename = path.basename(file, extname);
  var dirname = path.dirname(file);

  var id = path.join(dirname, basename);

  var count = this.counters[id] = (this.counters[id] || 0) + 1;

  return path.join(dirname, basename + count + extname);
};

Container.prototype.addEntry = function(entry) {
  this.entries.push(entry);
};

Container.prototype.addFile = function(name, data, options) {
  if (options && options.type) {
    this.contentTypes.override(name, options.type);
  }

  this.queue.push({
    content: data,
    meta: { name: name, type: 'file', store: options && options.store }
  });
};

Container.prototype.finalize = function() {
  var self = this;

  _.invoke(this.entries, 'finalize');

  this.rels.finalize();
  this.contentTypes.finalize();

  if(!this.queue.length) {
    this.zip.finalize();
  } else {
    this.queue.drain = function() {
      self.zip.finalize();
    };
  }

  return this.zip;
};

module.exports = Container;
