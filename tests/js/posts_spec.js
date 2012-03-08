describe("Phallanxpress posts collection", function() {
  var api;
  api = null;
  beforeEach(function() {
    return api = new Phallanxpress.Api('http://www.p-pi.org/blog/api/');
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