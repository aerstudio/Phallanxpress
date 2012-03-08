(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Phallanxpress.Tags = (function() {
    __extends(Tags, Phallanxpress.Collection);
    function Tags() {
      Tags.__super__.constructor.apply(this, arguments);
    }
    Tags.prototype.model = Phallanxpress.Tag;
    Tags.prototype.parseTag = 'tags';
    Tags.prototype.tagList = function(options) {
      return this._wpAPI('get_tag_index', options);
    };
    return Tags;
  })();
}).call(this);
