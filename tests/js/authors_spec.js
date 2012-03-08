(function() {
  describe("Phallanxpress authors collection", function() {
    var api, request;
    request = api = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return api = new Phallanxpress.Api('http://domain.com');
    });
    return describe('Authors list', function() {
      var authors;
      authors = request = null;
      beforeEach(function() {
        authors = api.authorList({
          forceRequest: true
        });
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.author_list.success);
      });
      return it('fetches all authors', function() {
        expect(request.url).toEqual("" + api.url + "get_author_index/");
        return expect(authors.length).toBeGreaterThan(0);
      });
    });
  });
}).call(this);
