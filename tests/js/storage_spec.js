(function() {
  describe('Phallanxpress storage', function() {
    var api, request;
    api = request = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return api = new Phallanxpress.Api('http://aerstudio.com');
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
      it("gets data from storage", function() {
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
        var render, v, view;
        render = jasmine.createSpy('render');
        view = new Backbone.View;
        view.render = render;
        v = api.recentPosts({
          view: view,
          params: {
            custom_fields: "f1,f2"
          }
        });
        return expect(render).toHaveBeenCalled();
      });
      it("triggers add event", function() {
        var render, v, view;
        render = jasmine.createSpy('render');
        view = new Backbone.View;
        view.render = render;
        v = api.recentPosts({
          view: view,
          add: true,
          params: {
            custom_fields: "f1,f2"
          }
        });
        return expect(render).toHaveBeenCalled();
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
    return describe("Models", function() {
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
  });
}).call(this);
