(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Phallanxpress.Categories = (function() {
    __extends(Categories, Phallanxpress.Collection);
    function Categories() {
      Categories.__super__.constructor.apply(this, arguments);
    }
    Categories.prototype.model = Phallanxpress.Category;
    Categories.prototype.parseTag = 'categories';
    Categories.prototype.categoryList = function(options) {
      return this._wpAPI('get_category_index', options);
    };
    Categories.prototype.topCategories = function() {
      var top;
      top = this.filter(function(model) {
        return model.get('parent') === 0;
      });
      return new Phallanxpress.Categories(top);
    };
    return Categories;
  })();
}).call(this);
