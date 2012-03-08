(function() {
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
      a = document.createElement('a');
      a.href = this.url;
      dnsprefetch = "<link rel=\"dns-prefetch\" href=\"" + a.protocol + "//" + a.hostname + "\">";
      linkTags = $("link[href*=\"" + a.protocol + "//" + a.hostname + "\"][rel=dns-prefetch]");
      if (linkTags.length === 0) {
        $('head').append(dnsprefetch);
      }
    }
    Api.prototype.recentPosts = function(options) {
      var posts, view;
      options || (options = {});
      posts = new Phallanxpress.Posts;
      posts.apiUrl = this.url;
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
      posts.apiUrl = this.url;
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
      posts.apiUrl = this.url;
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
      post.apiUrl = this.url;
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
      pages.apiUrl = this.url;
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
      page.apiUrl = this.url;
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
      categories.apiUrl = this.url;
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
      posts.apiUrl = this.url;
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
      tags.apiUrl = this.url;
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
      posts.apiUrl = this.url;
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
      authors.apiUrl = this.url;
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
      posts.apiUrl = this.url;
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
}).call(this);
