(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Phallanxpress.Posts = (function() {
    __extends(Posts, Phallanxpress.Collection);
    function Posts() {
      Posts.__super__.constructor.apply(this, arguments);
    }
    Posts.prototype.model = Phallanxpress.Post;
    Posts.prototype.parseTag = 'posts';
    Posts.prototype.defaultCount = 32;
    Posts.prototype.recentPosts = function(options) {
      return this._wpAPI('get_recent_posts', this._pageOptions(null, options));
    };
    Posts.prototype.categoryPosts = function(id, options) {
      return this._wpAPI('get_category_posts', this._pageOptions(id, options));
    };
    Posts.prototype.authorPosts = function(id, options) {
      return this._wpAPI('get_author_posts', this._pageOptions(id, options));
    };
    Posts.prototype.tagPosts = function(id, options) {
      return this._wpAPI('get_tag_posts', this._pageOptions(id, options));
    };
    Posts.prototype.searchPosts = function(query, options) {
      options = this._pageOptions(null, options);
      options.params.search = query;
      return this._wpAPI('get_search_results', options);
    };
    Posts.prototype.datePosts = function(date, options) {
      options = this._pageOptions(null, options);
      options.params.date = date;
      return this._wpAPI('get_date_posts', options);
    };
    Posts.prototype.pageUp = function(options) {
      return this.toPage(this.page + 1, options);
    };
    Posts.prototype.pageDown = function(options) {
      return this.toPage(this.page - 1, options);
    };
    Posts.prototype.toPage = function(page, options) {
      options = options && _.clone(options) || {};
      if (this.options != null) {
        options = _.defaults(options, this.options);
      }
      if ((page != null) && page >= 1 && page <= this.pages) {
        options.page = page;
        return this._wpAPI(this.currentCommand, this._pageOptions(this.apiObject, options));
      } else {
        return false;
      }
    };
    Posts.prototype._pageOptions = function(id, options) {
      options = options && _.clone(options) || {};
      options.params = options.params || {};
      if (id != null) {
        this.apiObject = id;
        if (_.isNumber(id)) {
          options.params.id = id;
        } else if (_.isString(id)) {
          options.params.slug = id;
        } else if (id.id != null) {
          options.params.id = id.id;
        }
      }
      options.params.count = options.count || this.defaultCount;
      this.page = options.page || 1;
      options.params.page = this.page;
      return options;
    };
    Posts.prototype.parse = function(resp, xhr) {
      if (resp.status === 'ok') {
        this.count_total = resp.count_total;
        this.pages = resp.pages;
        this.count = resp.count;
        if (this.count_total === 0) {
          this.trigger('no posts', resp, xhr);
          return null;
        } else {
          return resp.posts;
        }
      } else {
        this.trigger('error', resp.error, resp, xhr);
        return null;
      }
    };
    return Posts;
  })();
}).call(this);
