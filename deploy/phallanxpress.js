(function() {
  var $, Backbone, Phallanxpress, previousPhallanxpress, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  root = this;
  previousPhallanxpress = root.Phallanxpress;
  if (typeof exports !== 'undefined') {
    Phallanxpress = exports;
  } else {
    Phallanxpress = root.Phallanxpress = {};
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
  Phallanxpress.Api = (function() {
    function Api(url) {
      var a, dnsprefetch;
      this.url = url;
      Phallanxpress.apiURL = this.url;
      a = document.createElement('a');
      a.href = this.url;
      dnsprefetch = "<link rel=\"dns-prefetch\" href=\"" + a.protocol + "//" + a.hostname + "\">";
      $('head').append(dnsprefetch);
    }
    Api.prototype.recentPosts = function(options) {
      var posts, view;
      options || (options = {});
      posts = new Phallanxpress.Posts;
      view = this._bindView(posts, options.view);
      posts.recentPosts(options);
      if (view != null) {
        return view;
      } else {
        return posts;
      }
    };
    Api.prototype.searchPosts = function(query, options) {
      var posts, view;
      options || (options = {});
      posts = new Phallanxpress.Posts;
      view = this._bindView(posts, options.view);
      posts.searchPosts(query, options);
      if (view != null) {
        return view;
      } else {
        return posts;
      }
    };
    Api.prototype.datePosts = function(query, options) {
      var posts, view;
      options || (options = {});
      posts = new Phallanxpress.Posts;
      view = this._bindView(posts, options.view);
      posts.datePosts(query, options);
      if (view != null) {
        return view;
      } else {
        return posts;
      }
    };
    Api.prototype.post = function(id, options) {
      var post, view;
      options || (options = {});
      post = new Phallanxpress.Post;
      if (_.isNumber(id)) {
        post.id = id;
      } else if (_.isString(id)) {
        post.set({
          slug: id
        });
      } else {
        throw new Error('id must be a number or a string for a slug');
      }
      view = this._bindView(post, options.view);
      if (options.postType != null) {
        post.postType = options.postType;
      }
      post.fetch(options);
      if (view != null) {
        return view;
      } else {
        return post;
      }
    };
    Api.prototype.pageList = function(options) {
      var pages, view;
      options || (options = {});
      pages = new Phallanxpress.Pages;
      view = this._bindView(pages, options.view);
      pages.pageList(options);
      if (view != null) {
        return view;
      } else {
        return pages;
      }
    };
    Api.prototype.page = function(id, options) {
      var page, view;
      options || (options = {});
      page = new Phallanxpress.Page;
      if (_.isNumber(id)) {
        page.id = id;
      } else if (_.isString(id)) {
        page.set({
          slug: id
        });
      } else {
        throw new Error('id must be a number or a string for a slug');
      }
      view = this._bindView(page, options.view);
      page.fetch(options);
      if (view != null) {
        return view;
      } else {
        return page;
      }
    };
    Api.prototype.categoryList = function(options) {
      var categories, view;
      options || (options = {});
      categories = new Phallanxpress.Categories;
      view = this._bindView(categories, options.view);
      categories.categoryList(options);
      if (view != null) {
        return view;
      } else {
        return categories;
      }
    };
    Api.prototype.categoryPosts = function(id, options) {
      var posts, view;
      posts = new Phallanxpress.Posts;
      view = this._bindView(posts, options.view);
      posts.categoryPosts(id, options);
      if (view != null) {
        return view;
      } else {
        return posts;
      }
    };
    Api.prototype.tagList = function(options) {
      var tags, view;
      options || (options = {});
      tags = new Phallanxpress.Tags;
      view = this._bindView(tags, options.view);
      tags.tagList(options);
      if (view != null) {
        return view;
      } else {
        return tags;
      }
    };
    Api.prototype.tagPosts = function(id, options) {
      var posts, view;
      posts = new Phallanxpress.Posts;
      view = this._bindView(posts, options.view);
      posts.tagPosts(id, options);
      if (view != null) {
        return view;
      } else {
        return posts;
      }
    };
    Api.prototype.authorList = function(options) {
      var authors, view;
      options || (options = {});
      authors = new Phallanxpress.Authors;
      view = this._bindView(authors, options.view);
      authors.authorList(options);
      if (view != null) {
        return view;
      } else {
        return authors;
      }
    };
    Api.prototype.authorPosts = function(id, options) {
      var posts, view;
      posts = new Phallanxpress.Posts;
      view = this._bindView(posts, options.view);
      posts.authorPosts(id, options);
      if (view != null) {
        return view;
      } else {
        return posts;
      }
    };
    Api.prototype._bindView = function(obj, view) {
      var v;
      if (view != null) {
        if (view instanceof Backbone.View) {
          v = view;
          if (obj instanceof Backbone.Collection) {
            v.obj = obj;
            if (_.isFunction(v.render)) {
              obj.on('reset', v.render, v);
              obj.on('add', v.render, v);
            }
          } else {
            v.model = obj;
            if (_.isFunction(v.render)) {
              obj.on('change', v.render, v);
            }
          }
        } else if (_.isFunction(view)) {
          if (obj instanceof Backbone.Collection) {
            v = new view({
              collection: obj
            });
          } else {
            v = new view({
              model: obj
            });
          }
        } else {
          return null;
        }
        return v;
      } else {
        return null;
      }
    };
    return Api;
  })();
  Phallanxpress.Model = (function() {
    __extends(Model, Backbone.Model);
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    Model.prototype.apiCommand = '';
    Model.prototype.parseTag = '';
    Model.prototype.url = function() {
      var url;
      if (this.has('slug')) {
        url = "" + Phallanxpress.apiURL + apiCommand + "/?slug=" + (this.get('slug'));
      } else if (this.id != null) {
        url = "" + Phallanxpress.apiURL + apiCommand + "/?id=" + this.id;
      }
      if (this.postType != null) {
        url += '&post_type=#{@post_type}';
      }
      if (this.taxonomy != null) {
        url += '&taxonomy=@{@taxonomy}';
      }
      return url;
    };
    Model.prototype.parse = function(resp, xhr) {
      if (resp.status === 'ok') {
        return resp[this.parseTag];
      } else {
        return resp;
      }
    };
    Model.prototype.save = function() {};
    return Model;
  })();
  Phallanxpress.Tag = (function() {
    __extends(Tag, Phallanxpress.Model);
    function Tag() {
      Tag.__super__.constructor.apply(this, arguments);
    }
    return Tag;
  })();
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
    Category.prototype.posts = function(options) {
      var posts;
      posts = new Phallanxpress.Posts;
      posts.get_category_posts({
        id: this.id
      });
      return posts;
    };
    return Category;
  })();
  Phallanxpress.Post = (function() {
    __extends(Post, Phallanxpress.Model);
    function Post() {
      Post.__super__.constructor.apply(this, arguments);
    }
    Post.prototype.apiCommand = 'get_post';
    Post.prototype.parseTag = 'post';
    return Post;
  })();
  Phallanxpress.Page = (function() {
    __extends(Page, Phallanxpress.Model);
    function Page() {
      Page.__super__.constructor.apply(this, arguments);
    }
    Page.prototype.apiCommand = 'get_page';
    Page.prototype.parseTag = 'page';
    return Page;
  })();
  Phallanxpress.Author = (function() {
    __extends(Author, Phallanxpress.Model);
    function Author() {
      Author.__super__.constructor.apply(this, arguments);
    }
    return Author;
  })();
  Phallanxpress.Collection = (function() {
    __extends(Collection, Backbone.Collection);
    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }
    Collection.prototype.getBySlug = function(slug) {
      var models;
      models = this.filter(function(model) {
        return model.get('slug') === slug;
      });
      switch (models.length) {
        case 1:
          return models[0];
        case 0:
          return null;
        default:
          throw new Error('More than one post with the same slug');
      }
    };
    Collection.prototype._wpAPI = function(cmd, options) {
      var post_type, success, taxonomy, url;
      if (cmd == null) {
        throw new Error('an api command must be defined');
      }
      this.isLoading = true;
      options = options && _.clone(options) || {};
      url = Phallanxpress.apiURL;
      url += cmd + '/';
      options.params = options.params || {};
      this.currentCommand = cmd;
      post_type = options.post_type || this.postType;
      if (post_type != null) {
        options.params['post_type'] = post_type;
      }
      if (this.customFields) {
        options.params['custom_fields'] = this.customFields;
      }
      taxonomy = options.taxonomy || this.taxonomy;
      if (taxonomy) {
        options.params['taxonomy'] = taxonomy;
      }
      if (!_.isEmpty(options.params)) {
        url += '?' + $.param(options.params);
      }
      this.currentParams = options.params;
      this.url = url;
      success = options.success;
      options.success = __bind(function(resp, status, xhr) {
        this.isLoading = false;
        if (success != null) {
          return success(this, resp);
        }
      }, this);
      this.options = _.clone(options);
      delete this.options.success;
      if (!options.add) {
        this.reset();
      }
      this.fetch(options);
      return this;
    };
    Collection.prototype.resetVars = function() {
      return this.page = this.pages = this.count = this.count_total = null;
    };
    Collection.prototype.parse = function(resp, xhr) {
      if (resp.status === 'ok') {
        return resp[this.parseTag];
      }
      this.trigger('error', resp.error, resp, xhr);
      return null;
    };
    Collection.prototype.save = function() {};
    return Collection;
  })();
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
