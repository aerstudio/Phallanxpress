(function() {
  describe('Phallanxpress storage', function() {
    var api, request;
    api = request = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return api = new Phallanxpress.Api('http://cached.com');
    });
    describe("Enable / Disable", function() {
      var numRequests, posts;
      posts = numRequests = null;
      beforeEach(function() {
        numRequests = ajaxRequests.length;
        posts = api.recentPosts({
          forceRequest: true,
          params: {
            custom_fields: "e1,f2"
          }
        });
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.posts.success);
      });
      it("disables the cache", function() {
        api.cache.disable();
        request.url += 'e';
        numRequests = ajaxRequests.length;
        posts = api.recentPosts({
          params: {
            custom_fields: "e1,f2"
          }
        });
        expect(ajaxRequests.length).toEqual(numRequests + 1);
        return expect(mostRecentAjaxRequest().url).toEqual(posts.url);
      });
      return it("enables the cache", function() {
        api.cache.enable();
        request = mostRecentAjaxRequest();
        request.url += 'e';
        numRequests = ajaxRequests.length;
        posts = api.recentPosts({
          params: {
            custom_fields: "e1,f2"
          }
        });
        expect(ajaxRequests.length).toEqual(numRequests);
        return expect(mostRecentAjaxRequest().url).not.toEqual(posts.url);
      });
    });
    describe("Collections", function() {
      var numRequests, posts;
      posts = numRequests = null;
      beforeEach(function() {
        numRequests = ajaxRequests.length;
        posts = api.recentPosts({
          forceRequest: true,
          params: {
            custom_fields: "f1,f2"
          }
        });
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.posts.success);
      });
      it("forces the request", function() {
        expect(ajaxRequests.length).toEqual(numRequests + 1);
        return expect(request.url).toEqual(posts.url);
      });
      it("gets data from cache", function() {
        var length, models;
        posts = api.recentPosts({
          params: {
            custom_fields: "d1,d2"
          },
          forceRequest: true
        });
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.success);
        length = posts.length;
        models = posts.pluck('id');
        posts.reset();
        expect(posts.length).toEqual(0);
        request.url += 'd';
        numRequests = ajaxRequests.length;
        posts = api.recentPosts({
          params: {
            custom_fields: "d1,d2"
          }
        });
        expect(posts.length).toEqual(length);
        expect(ajaxRequests.length).toEqual(numRequests);
        expect(mostRecentAjaxRequest().url).not.toEqual(posts.url);
        return expect(posts.pluck('id')).toEqual(models);
      });
      it("triggers reset event", function() {
        var View, add, reset, v;
        reset = jasmine.createSpy('reset');
        add = jasmine.createSpy('add');
        View = Backbone.View.extend({
          initialize: function() {
            this.collection.on('reset', reset, this);
            return this.collection.on('add', add, this);
          }
        });
        v = api.recentPosts({
          view: View,
          params: {
            custom_fields: "f1,f2"
          }
        });
        expect(reset).toHaveBeenCalled();
        return expect(add).not.toHaveBeenCalled();
      });
      it("triggers add event", function() {
        var View, add, reset, v;
        reset = jasmine.createSpy('reset');
        add = jasmine.createSpy('add');
        View = Backbone.View.extend({
          initialize: function() {
            this.collection.on('add', add, this);
            return this.collection.on('reset', reset, this);
          }
        });
        v = api.recentPosts({
          view: View,
          add: true,
          params: {
            custom_fields: "f1,f2"
          }
        });
        expect(add).toHaveBeenCalled();
        return expect(reset).not.toHaveBeenCalled();
      });
      return it("makes a request if expired", function() {
        runs(function() {
          numRequests = ajaxRequests.length;
          api.cache.expireTime = 1 / 3600000 * 10;
          posts = api.recentPosts({
            forceRequest: true,
            params: {
              custom_fields: "f6,f2"
            }
          });
          expect(ajaxRequests.length).toEqual(numRequests + 1);
          request = mostRecentAjaxRequest();
          request.response(TestResponses.posts.success);
          return request.url += 'd';
        });
        waits(20);
        return runs(function() {
          numRequests = ajaxRequests.length;
          posts = api.recentPosts({
            params: {
              custom_fields: "f6,f2"
            }
          });
          expect(ajaxRequests.length).toEqual(numRequests + 1);
          return expect(mostRecentAjaxRequest().url).toEqual(posts.url);
        });
      });
    });
    describe("Models", function() {
      var post;
      post = null;
      beforeEach(function() {
        post = api.post(1318, {
          forceRequest: true
        });
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.post.success);
      });
      it("forces the request", function() {
        return expect(request.url).toEqual("" + api.url + "get_post/?id=" + post.id);
      });
      it("gets data from storage", function() {
        var numRequests, slug;
        slug = post.get('slug');
        numRequests = ajaxRequests.length;
        post = api.post(1318);
        expect(ajaxRequests.length).toEqual(numRequests);
        expect(post.get('slug')).toEqual(slug);
        return expect(post.get('phallanxTimestamp')).toBeUndefined();
      });
      return it("make a request if expired", function() {
        var url;
        url = null;
        runs(function() {
          var numRequests;
          numRequests = ajaxRequests.length;
          post = api.post(1318, {
            forceRequest: true
          });
          api.cache.expireTime = 1 / 3600000 * 10;
          expect(ajaxRequests.length).toEqual(numRequests + 1);
          request = mostRecentAjaxRequest();
          request.response(TestResponses.post.success);
          url = request.url;
          return request.url += 'd';
        });
        waits(20);
        return runs(function() {
          var numRequests;
          numRequests = ajaxRequests.length;
          post = api.post(1318);
          expect(ajaxRequests.length).toEqual(numRequests + 1);
          return expect(mostRecentAjaxRequest().url).toEqual(url);
        });
      });
    });
    return describe('Cleaning', function() {
      it('cleans all expired calls', function() {
        var objects;
        objects = api.cache.objects;
        api.recentPosts({
          forceRequest: true,
          params: {
            custom_fields: 'g5,gh,gp'
          }
        });
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.success);
        api.cache.expireTime = 1 / 3600000 * 100;
        api.cache.cleanStorage();
        expect(api.cache.objects.length).not.toEqual(objects.length);
        expect(api.cache.objects.length).toBeGreaterThan(0);
        return expect(_.include(api.cache.objects, request.url)).toBeTruthy();
      });
      return it('forces a clean of all cache', function() {
        var obj, objects;
        api.recentPosts({
          forceRequest: true,
          params: {
            custom_fields: 'g5,gh,g98'
          }
        });
        objects = api.cache.objects;
        api.cache.expireTime = 24;
        api.cache.cleanStorage(true);
        expect(api.cache.objects.length).toEqual(0);
        _.each(objects, function(id) {
          var obj;
          obj = api.cache.storage.getItem(id);
          return expect(obj).toBeNull();
        });
        obj = api.cache.storage.getItem(api.url);
        return expect(obj).toBeNull();
      });
    });
  });
}).call(this);
