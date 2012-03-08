(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
        throw new Error('An api command must be defined');
      }
      if (this.apiUrl == null) {
        throw new Error('An api URL must be defind');
      }
      this.isLoading = true;
      options = options && _.clone(options) || {};
      url = this.apiUrl;
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
}).call(this);
