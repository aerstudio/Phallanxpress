(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Phallanxpress.Category = (function() {
    __extends(Category, Phallanxpress.Model);
    function Category() {
      Category.__super__.constructor.apply(this, arguments);
    }
    Category.prototype.children = function() {
      return this.collection.filter(__bind(function(model) {
        return model.get('parent') === this.id;
      }, this));
    };
    return Category;
  })();
}).call(this);
