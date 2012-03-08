(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Phallanxpress.Storage = (function() {
    Storage.prototype.expireTime = 24;
    function Storage(name) {
      this.name = name;
    }
    Storage.prototype.saveCollection = function(collection) {
      var col;
      if (collection.length === 0) {
        return;
      }
      col = {
        ids: collection.pluck('id'),
        timestamp: new Date().getTime()
      };
      localStorage.setItem(collection.url, JSON.stringify(col));
      return collection.each(__bind(function(model) {
        return this.saveModel(model);
      }, this));
    };
    Storage.prototype.saveModel = function(model) {
      var now;
      now = new Date();
      model.set({
        phallanxTimestamp: now.getTime(),
        silent: true
      });
      return localStorage.setItem(this.name + model.constructor.name.toLowerCase() + '/' + model.id, JSON.stringify(model));
    };
    Storage.prototype.getCollection = function(collection) {
      var col, elapsedTime, modelName, models;
      col = JSON.parse(localStorage.getItem(collection.url));
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
      if (attr == null) {
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
      return JSON.parse(localStorage.getItem(this.name + modelName.toLowerCase() + '/' + id));
    };
    Storage.prototype.destroyCollection = function(collection) {
      return localStorage.removeItem(collection.url);
    };
    return Storage;
  })();
}).call(this);
