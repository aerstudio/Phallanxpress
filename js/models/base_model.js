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
      var url;
      console.log(this.apiCommand);
      if (this.apiUrl == null) {
        throw new Error('An api URL must be defined');
      }
      if (this.apiCommand == null) {
        throw new Error('An api command must be defined');
      }
      if (this.has('slug')) {
        url = "" + this.apiUrl + this.apiCommand + "/?slug=" + (this.get('slug'));
      } else if (this.id != null) {
        url = "" + this.apiUrl + this.apiCommand + "/?id=" + this.id;
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
