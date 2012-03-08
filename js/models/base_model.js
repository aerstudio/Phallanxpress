(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
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
        fetched = this.api.storage.getModel(this);
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
}).call(this);
