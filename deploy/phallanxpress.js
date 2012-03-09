(function() {
  var $, Backbone, Phallanxpress, inBrowser, previousPhallanxpress, root, _;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
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
  Phallanxpress.Cache = (function() {
    Cache.prototype.expireTime = 24;
    function Cache(name) {
      this.name = name;
      _.extend(this, Backbone.Events);
      this.enable();
      this.objects = (JSON.parse(this.storage.getItem(this.name))) || [];
    }
    Cache.prototype.enable = function(options) {
      if (options == null) {
        options = {};
      }
      if (!(typeof window !== "undefined" && window !== null) && !window.localStorage && !window.sessionStorage) {
        return;
      }
      if (options.sessionStorage) {
        return this.storage = window.sessionStorage;
      } else {
        return this.storage = window.localStorage;
      }
    };
    Cache.prototype.disable = function() {
      return this.storage = null;
    };
    Cache.prototype.saveCollection = function(collection) {
      var col;
      if (collection.length === 0 || !(this.storage != null)) {
        return;
      }
      col = {
        ids: collection.pluck('id'),
        timestamp: new Date().getTime(),
        count: collection.count,
        count_total: collection.count_total,
        pages: collection.pages,
        page: collection.page,
        options: collection.options
      };
      try {
        this.storage.removeItem(collection.url);
        this.storage.setItem(collection.url, JSON.stringify(col));
        collection.each(__bind(function(model) {
          return this.saveModel(model);
        }, this));
        return this.saveId(collection.url);
      } catch (error) {
        if (error === QUOTA_EXCEEDED_ERR) {
          this.cleanStorage();
          this.trigger('quota exceeded');
        } else {
          throw error;
        }
      }
    };
    Cache.prototype.saveModel = function(model) {
      var id, now;
      if (this.storage == null) {
        return;
      }
      now = new Date();
      model.set({
        phallanxTimestamp: now.getTime(),
        silent: true
      });
      try {
        id = this.name + model.constructor.name.toLowerCase() + '/' + model.id;
        this.storage.removeItem(id);
        this.storage.setItem(id, JSON.stringify(model));
        return this.saveId(id);
      } catch (error) {
        if (error === QUOTA_EXCEEDED_ERR) {
          this.cleanStorage();
          this.trigger('quota exceeded');
        } else {
          throw error;
        }
      }
    };
    Cache.prototype.getCollection = function(collection, options) {
      var col, elapsedTime, modelName, models;
      if (options == null) {
        options = {};
      }
      if (this.storage == null) {
        return false;
      }
      col = JSON.parse(this.storage.getItem(collection.url));
      if (col != null) {
        elapsedTime = new Date().getTime() - col.timestamp;
        if (elapsedTime < this.expireTime * 3600000) {
          modelName = (new collection.model()).constructor.name;
          models = _.map(col.ids, __bind(function(id) {
            var attributes;
            return attributes = this.getModelAttributes(id, modelName);
          }, this));
          collection.count = col.count;
          collection.count_total = col.count_total;
          collection.page = col.page;
          collection.pages = col.pages;
          collection.options = col.options;
          if (options.add) {
            collection.add(models, options);
          } else {
            collection.reset(models, options);
          }
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    Cache.prototype.getModel = function(model) {
      var attr, elapsedTime, timestamp;
      attr = this.getModelAttributes(model.id, model.constructor.name);
      if (!((attr != null) || (this.storage != null))) {
        return false;
      }
      if (attr.phallanxTimestamp != null) {
        timestamp = +attr.phallanxTimestamp || 0;
        delete attr.phallanxTimestamp;
        elapsedTime = new Date().getTime() - timestamp;
        if (elapsedTime < this.expireTime * 3600000) {
          model.set(attr, {
            silent: true
          });
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    Cache.prototype.getModelAttributes = function(id, modelName) {
      if (this.storage == null) {
        return null;
      }
      return JSON.parse(this.storage.getItem(this.name + modelName.toLowerCase() + '/' + id));
    };
    Cache.prototype.saveId = function(id) {
      if (this.storage == null) {
        return;
      }
      if (!_.include(this.objects, id)) {
        this.objects.push(id);
        return this.storage.setItem(this.name, JSON.stringify(this.objects));
      }
    };
    Cache.prototype.cleanStorage = function(forceCleanAll) {
      var removedIds;
      if (forceCleanAll == null) {
        forceCleanAll = false;
      }
      removedIds = [];
      _.each(this.objects, __bind(function(id) {
        var data, elapsedTime;
        data = JSON.parse(this.storage.getItem(id));
        elapsedTime = new Date().getTime() - (data.timestamp || data.phallanxTimestamp);
        if (elapsedTime > this.expireTime * 3600000 || forceCleanAll) {
          this.storage.removeItem(id);
          return removedIds.push(id);
        }
      }, this));
      this.objects = _.difference(this.objects, removedIds);
      if (this.objects.length > 0) {
        return this.storage.setItem(this.name, JSON.stringify(this.objects));
      } else {
        return this.storage.removeItem(this.name);
      }
    };
    return Cache;
  })();
  Phallanxpress.Api = (function() {
    function Api(url) {
      var a, dnsprefetch, linkTags;
      this.url = url;
      if (this.url == null) {
        throw new Error('URL must be defined');
      }
      if (this.url.slice(-1) !== '/') {
        this.url += '/';
      }
      if (typeof window !== "undefined" && window !== null) {
        a = document.createElement('a');
        a.href = this.url;
        dnsprefetch = "<link rel=\"dns-prefetch\" href=\"" + a.protocol + "//" + a.hostname + "\">";
        linkTags = $("link[href*=\"" + a.protocol + "//" + a.hostname + "\"][rel=dns-prefetch]");
        if (linkTags.length === 0) {
          $('head').append(dnsprefetch);
        }
      }
      this.cache = new Phallanxpress.Cache(this.url);
    }
    Api.prototype.recentPosts = function(options) {
      var posts, view;
      options || (options = {});
      posts = new Phallanxpress.Posts;
      posts.api = this;
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
      posts.api = this;
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
      posts.api = this;
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
      post.api = this;
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
      pages.api = this;
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
      page.api = this;
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
      categories.api = this;
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
      options || (options = {});
      posts = new Phallanxpress.Posts;
      posts.api = this;
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
      tags.api = this;
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
      options || (options = {});
      posts = new Phallanxpress.Posts;
      posts.api = this;
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
      authors.api = this;
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
      options || (options = {});
      posts = new Phallanxpress.Posts;
      posts.api = this;
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
      if (view == null) {
        return null;
      }
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
    };
    return Api;
  })();
  Phallanxpress.Model = (function() {
    __extends(Model, Backbone.Model);
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    Model.prototype.url = function() {
      var rootUrl, url;
      if (this.apiCommand == null) {
        throw new Error('An api command must be defined');
      }
      if (!((this.apiUrl != null) || (this.api != null))) {
        throw new Error('An api or apiUrl must be defined');
      }
      rootUrl = this.apiUrl || this.api.url;
      if (this.id != null) {
        url = "" + rootUrl + this.apiCommand + "/?id=" + this.id;
      } else if (this.has('slug')) {
        url = "" + rootUrl + this.apiCommand + "/?slug=" + (this.get('slug'));
      }
      if (this.postType != null) {
        url += '&post_type=#{@post_type}';
      }
      if (this.taxonomy != null) {
        url += '&taxonomy=@{@taxonomy}';
      }
      return url;
    };
    Model.prototype.fetch = function(options) {
      var fetched, forced;
      options = options || {};
      forced = options.forceRequest || false;
      if ((this.api != null) && !forced) {
        fetched = this.api.cache.getModel(this);
      }
      if (!fetched) {
        Model.__super__.fetch.apply(this, arguments);
      } else {
        if (!options.silent) {
          this.trigger('change', this, options);
        }
        if (options.success != null) {
          options.success(this, null);
        }
      }
      return this;
    };
    Model.prototype.parse = function(resp, xhr) {
      if (resp.status === 'ok') {
        if (_.isEmpty(this.parseTag)) {
          return resp;
        } else {
          return resp[this.parseTag];
        }
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
      var fetched, forced, post_type, success, taxonomy, url;
      if (cmd == null) {
        throw new Error('An api command must be defined');
      }
      if (!((this.apiUrl != null) || (this.api != null))) {
        throw new Error('An api or apiUrl must be defind');
      }
      this.isLoading = true;
      options = options && _.clone(options) || {};
      url = this.apiUrl || this.api.url;
      url += cmd + '/';
      options.params = options.params || {};
      this.currentCommand = cmd;
      post_type = options.postType || this.postType;
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
        if (this.api != null) {
          this.api.cache.saveCollection(this);
        }
        if (success != null) {
          return success(this, resp);
        }
      }, this);
      this.options = _.clone(options);
      delete this.options.success;
      fetched = false;
      forced = options.forceRequest || false;
      if ((this.api != null) && !forced) {
        fetched = this.api.cache.getCollection(this, options);
      }
      if (!fetched) {
        if (!options.add) {
          this.reset();
        }
        this.fetch(options);
      } else {
        this.isLoading = false;
        if (success != null) {
          success(this, null);
        }
      }
      return this;
    };
    Collection.prototype.resetVars = function() {
      return this.page = this.pages = this.count = this.count_total = this.options = this.currentCommand = this.currentParams = this.apiObject = null;
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
      var top, tops;
      top = this.filter(function(model) {
        return model.get('parent') === 0;
      });
      tops = new Phallanxpress.Categories(top);
      tops.api = this.api;
      tops.apiUrl = this.apiUrl;
      return tops;
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
      this.resetVars();
      return this._wpAPI('get_recent_posts', this._pageOptions(null, options));
    };
    Posts.prototype.categoryPosts = function(id, options) {
      this.resetVars();
      return this._wpAPI('get_category_posts', this._pageOptions(id, options));
    };
    Posts.prototype.authorPosts = function(id, options) {
      this.resetVars();
      return this._wpAPI('get_author_posts', this._pageOptions(id, options));
    };
    Posts.prototype.tagPosts = function(id, options) {
      this.resetVars();
      return this._wpAPI('get_tag_posts', this._pageOptions(id, options));
    };
    Posts.prototype.searchPosts = function(query, options) {
      this.resetVars();
      options = this._pageOptions(null, options);
      options.params.search = query;
      return this._wpAPI('get_search_results', options);
    };
    Posts.prototype.datePosts = function(date, options) {
      this.resetVars();
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
      if ((page != null) && page >= 1 && (!(this.pages != null) || page <= this.pages)) {
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
