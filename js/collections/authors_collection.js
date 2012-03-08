(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Phallanxpress.Authors = (function() {
    __extends(Authors, Phallanxpress.Collection);
    function Authors() {
      Authors.__super__.constructor.apply(this, arguments);
    }
    Authors.prototype.model = Phallanxpress.Author;
    Authors.prototype.parseTag = 'authors';
    Authors.prototype.authorList = function(options) {
      return this._wpAPI('get_author_index', options);
    };
    return Authors;
  })();
}).call(this);
