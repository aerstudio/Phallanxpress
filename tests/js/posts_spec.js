(function() {
  describe("Phallanxpress posts collection", function() {
    var api, fakeResponse, request;
    request = fakeResponse = api = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      api = new Phallanxpress.Api('http://domain.com');
      return fakeResponse = TestResponses.posts;
    });
    it("gets recent posts", function() {
      var posts;
      posts = api.recentPosts();
      return posts.on('reset', function() {
        return console.log(posts);
      });
    });
    return it("gets associated with a view", function() {
      var view;
      view = api.recentPosts({
        view: Backbone.View
      });
      spyOn(view.render);
      return expect(view.render).toHaveBeenCalled();
    });
  });
}).call(this);
