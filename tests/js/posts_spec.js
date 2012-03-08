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
        posts = api.recentPosts();
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?count=" + posts.defaultCount + "&page=" + posts.page);
      });
      it("builds the right url with options, post types and taxonomies", function() {
        var posts;
        posts = api.recentPosts({
          taxonomy: 'new_tax',
          postType: 'type',
          params: {
            custom_fiels: 'field1,field2'
          }
        });
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?custom_fiels=field1%2Cfield2&count=32&page=1&post_type=type&taxonomy=new_tax");
      });
      it(" builds url with id if a number is passed", function() {
        var posts;
        posts = api.categoryPosts(7);
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_category_posts/?id=7&count=32&page=1");
      });
      it(" builds url with slug if a string is passed", function() {
        var posts;
        posts = api.categoryPosts('cat1');
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_category_posts/?slug=cat1&count=32&page=1");
      });
      return it(" builds url with id if a model is passed", function() {
        var cat, posts;
        cat = new Phallanxpress.Category({
          id: 7
        });
        posts = api.categoryPosts(cat);
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_category_posts/?id=7&count=32&page=1");
      });
    });
    describe('Pagination', function() {
      it("gets the next page", function() {
        var posts;
        posts = api.recentPosts({
          count: 2
        });
        posts.pageUp();
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?count=2&page=2");
      });
      it("gets the previous page", function() {
        var posts;
        posts = api.recentPosts({
          taxonomy: 'cat',
          page: 2
        });
        posts.pageDown();
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?count=32&page=1&taxonomy=cat");
      });
      return it("gets a given page", function() {
        var posts;
        posts = api.recentPosts({
          taxonomy: 'cat',
          postType: 'type',
          page: 2
        });
        posts.toPage(4);
        return expect(mostRecentAjaxRequest().url).toEqual("" + api.url + "get_recent_posts/?count=32&page=4&post_type=type&taxonomy=cat");
      });
    });
    describe('Fetching posts', function() {
      var posts;
      posts = null;
      beforeEach(function() {
        posts = api.recentPosts();
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.posts.success);
      });
      it('gets the posts', function() {
        return expect(posts.length).toEqual(5);
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
      return it('gets a post by slug', function() {
        return expect(posts.getBySlug('test-slug')).toBeDefined();
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
