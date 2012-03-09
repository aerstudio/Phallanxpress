(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
        timestamp: new Date().getTime()
      };
      try {
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
    Cache.prototype.getCollection = function(collection) {
      var col, elapsedTime, modelName, models;
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
          if (collection.options.add) {
            collection.add(models, {
              silent: true
            });
          } else {
            collection.reset(models, {
              silent: true
            });
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
}).call(this);
