(function() {
  describe("Phallanxpress Post Model", function() {
    var post;
    post = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return post = new Phallanxpress.Post({
        id: 1
      });
    });
    describe('Unit tests', function() {
      return it('throws an error if not defined apiURL', function() {
        return expect(function() {
          return post.fetch();
        }).toThrow('An api or apiUrl must be defined');
      });
    });
    return describe('Fetching', function() {
      beforeEach(function() {
        return post.apiUrl = 'http://domain.com/';
      });
      it('fetches a post given an id', function() {
        post.fetch();
        return expect(mostRecentAjaxRequest().url).toEqual("" + post.apiUrl + "get_post/?id=1");
      });
      return it('fetches a post given a slug', function() {
        post.id = null;
        post.set('slug', 'test-slug');
        post.fetch();
        return expect(mostRecentAjaxRequest().url).toEqual("" + post.apiUrl + "get_post/?slug=test-slug");
      });
    });
  });
}).call(this);
