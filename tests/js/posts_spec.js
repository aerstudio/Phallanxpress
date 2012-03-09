(function() {
  describe("Phallanxpress posts collection", function() {
    var api, request;
    request = api = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return api = new Phallanxpress.Api('http://domain.com');
    });
    describe('URL building', function() {
      it("builds the right url by default", function() {
        var posts;
        posts = api.recentPosts({
          forceRequest: true
        });
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?count=" + posts.defaultCount + "&page=" + posts.page);
      });
      it("builds the right url with options, post types and taxonomies", function() {
        var posts;
        posts = api.recentPosts({
          taxonomy: 'new_tax',
          postType: 'type',
          params: {
            custom_fiels: 'field1,field2'
          },
          forceRequest: true
        });
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?custom_fiels=field1%2Cfield2&count=32&page=1&post_type=type&taxonomy=new_tax");
      });
      it(" builds url with id if a number is passed", function() {
        var posts;
        posts = api.categoryPosts(7, {
          forceRequest: true
        });
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_category_posts/?id=7&count=32&page=1");
      });
      it(" builds url with slug if a string is passed", function() {
        var posts;
        posts = api.categoryPosts('cat1', {
          forceRequest: true
        });
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_category_posts/?slug=cat1&count=32&page=1");
      });
      return it(" builds url with id if a model is passed", function() {
        var cat, posts;
        cat = new Phallanxpress.Category({
          id: 7
        });
        posts = api.categoryPosts(cat, {
          forceRequest: true
        });
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_category_posts/?id=7&count=32&page=1");
      });
    });
    describe('Pagination', function() {
      it("gets the next page", function() {
        var posts;
        posts = api.recentPosts({
          count: 2,
          forceRequest: true
        });
        posts.pageUp();
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?count=2&page=2");
      });
      it("gets the previous page", function() {
        var posts;
        posts = api.recentPosts({
          taxonomy: 'cat',
          page: 2,
          forceRequest: true
        });
        posts.pageDown();
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?count=32&page=1&taxonomy=cat");
      });
      it("gets a given page", function() {
        var posts;
        posts = api.recentPosts({
          taxonomy: 'cat',
          postType: 'type',
          page: 2,
          forceRequest: true
        });
        posts.toPage(4);
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?count=32&page=4&post_type=type&taxonomy=cat");
      });
      return it("adds the next page to current results", function() {
        var posts;
        posts = api.recentPosts();
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.success);
        posts.pageUp({
          add: true
        });
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.page2);
        return expect(posts.length).toEqual(7);
      });
    });
    describe('Fetching posts', function() {
      var posts;
      posts = null;
      beforeEach(function() {
        posts = api.recentPosts({
          forceRequest: true
        });
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.posts.success);
      });
      it('gets the posts', function() {
        return expect(posts.length).toEqual(5);
      });
      it('triggers a no posts event', function() {
        var no_posts;
        no_posts = jasmine.createSpy('no posts');
        posts = api.searchPosts('no key');
        posts.on('no posts', no_posts);
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.not_found);
        return expect(no_posts).toHaveBeenCalled();
      });
      it('triggers an error event', function() {
        var error;
        error = jasmine.createSpy('error');
        posts = api.searchPosts('no key');
        posts.on('error', error);
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.error);
        return expect(error).toHaveBeenCalled();
      });
      it('has the right length', function() {
        return expect(posts.length).toEqual(posts.count);
      });
      it('has all the pagination metadata', function() {
        expect(posts.count_total).toBeDefined();
        expect(posts.page).toEqual(1);
        expect(posts.pages).toBeDefined();
        posts.pageUp();
        return expect(posts.page).toEqual(2);
      });
      it('gets a post by slug', function() {
        return expect(posts.getBySlug('test-slug')).toBeDefined();
      });
      it('associated with a view if passed the object', function() {
        var View, render, v;
        render = jasmine.createSpy('render');
        View = Backbone.View.extend({
          initialize: function() {
            this.render = render;
            return this.collection.on('reset', this.render, this);
          }
        });
        v = api.recentPosts({
          view: View,
          forceRequest: true
        });
        return expect(render).toHaveBeenCalled();
      });
      it('associated with a view if passed an instance', function() {
        var render, v, view;
        render = jasmine.createSpy('render');
        view = new Backbone.View;
        view.render = render;
        v = api.recentPosts({
          view: view,
          forceRequest: true
        });
        return expect(render).toHaveBeenCalled();
      });
      it('calls the success callback when finished', function() {
        var success;
        success = jasmine.createSpy('success');
        api.recentPosts({
          success: success,
          forceRequest: true
        });
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.success);
        return expect(success).toHaveBeenCalled();
      });
      it('triggers a reset event', function() {
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
          forceRequest: true,
          params: {
            custom_fields: "g1,f2"
          }
        });
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.success);
        expect(add).not.toHaveBeenCalled();
        return expect(reset).toHaveBeenCalled();
      });
      return it('triggers a add event', function() {
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
          forceRequest: true,
          add: true,
          params: {
            custom_fields: "g1,f2"
          }
        });
        request = mostRecentAjaxRequest();
        request.response(TestResponses.posts.success);
        expect(add).toHaveBeenCalled();
        return expect(reset).not.toHaveBeenCalled();
      });
    });
    return describe('Fetching methods', function() {
      it('gets search posts', function() {
        var posts;
        posts = api.searchPosts('query');
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_search_results/?count=32&page=1&search=query");
      });
      it('gets author posts', function() {
        var posts;
        posts = api.authorPosts('cristina');
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_author_posts/?slug=cristina&count=32&page=1");
      });
      it('gets tag posts', function() {
        var posts;
        posts = api.tagPosts('javascript');
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_tag_posts/?slug=javascript&count=32&page=1");
      });
      it('gets category posts', function() {
        var posts;
        posts = api.categoryPosts(7, {
          taxonomy: 'cat',
          postType: 'type'
        });
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_category_posts/?id=7&count=32&page=1&post_type=type&taxonomy=cat");
      });
      return it('gets date posts', function() {
        var posts;
        posts = api.datePosts('2012-03-07');
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_date_posts/?count=32&page=1&date=2012-03-07");
      });
    });
  });
}).call(this);
