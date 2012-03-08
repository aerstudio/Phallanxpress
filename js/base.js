(function() {
  var $, Backbone, Phallanxpress, inBrowser, previousPhallanxpress, root, _;
  root = this;
  previousPhallanxpress = root.Phallanxpress;
  if (typeof exports !== 'undefined') {
    Phallanxpress = exports.Phallanxpress = {};
    inBrowser = false;
  } else {
    Phallanxpress = root.Phallanxpress = {};
    inBrowser = true;
  }
  Phallanxpress.VERSION = '0.1.0';
  _ = root._;
  if (!_ && typeof require !== 'undefined') {
    _ = require('underscore');
  }
  Backbone = root.Backbone;
  if (!Backbone && typeof require !== 'undefined') {
    Backbone = require('backbone');
  }
  $ = root.jQuery || root.Zepto || root.ender;
  Phallanxpress.noConflict = function() {
    root.Phallanxpress = previousPhallanxpress;
    return this;
  };
}).call(this);
