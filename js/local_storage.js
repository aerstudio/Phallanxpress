(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Phallanxpress.Storage = (function() {
    Storage.prototype.expireTime = 24;
    function Storage(name) {
      this.name = name;
      this.enable();
    }
    Storage.prototype.enable = function() {
      if (typeof window !== "undefined" && window !== null) {
        return this.storage = window.localStorage;
      }
    };
    Storage.prototype.disable = function() {
      return this.storage = null;
    };
    Storage.prototype.saveCollection = function(collection) {
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
      } catch (error) {
        if (error === QUOTA_EXCEEDED_ERR) {
          return;
        } else {
          throw error;
        }
      }
      return collection.each(__bind(function(model) {
        return this.saveModel(model);
      }, this));
    };
    Storage.prototype.saveModel = function(model) {
      var now;
      if (this.storage == null) {
        return;
      }
      now = new Date();
      model.set({
        phallanxTimestamp: now.getTime(),
        silent: true
      });
      try {
        return this.storage.setItem(this.name + model.constructor.name.toLowerCase() + '/' + model.id, JSON.stringify(model));
      } catch (error) {
        if (error === QUOTA_EXCEEDED_ERR) {} else {
          throw error;
        }
      }
    };
    Storage.prototype.getCollection = function(collection) {
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
          this.destroyCollection(collection);
          return false;
        }
      } else {
        return false;
      }
    };
    Storage.prototype.getModel = function(model) {
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
    Storage.prototype.getModelAttributes = function(id, modelName) {
      return JSON.parse(this.storage.getItem(this.name + modelName.toLowerCase() + '/' + id));
    };
    Storage.prototype.destroyCollection = function(collection) {
      if (this.storage == null) {
        return;
      }
      return this.storage.removeItem(collection.url);
    };
    return Storage;
  })();
}).call(this);
