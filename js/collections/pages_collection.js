(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Phallanxpress.Pages = (function() {
    __extends(Pages, Phallanxpress.Collection);
    function Pages() {
      Pages.__super__.constructor.apply(this, arguments);
    }
    Pages.prototype.model = Phallanxpress.Page;
    Pages.prototype.parseTag = 'pages';
    Pages.prototype.pageList = function(options) {
      return this._wpAPI('get_page_index', options);
    };
    return Pages;
  })();
}).call(this);
