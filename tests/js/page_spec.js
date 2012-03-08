(function() {
  describe("Phallanxpress pages collection", function() {
    var api, request;
    request = api = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return api = new Phallanxpress.Api('http://domain.com');
    });
    return describe('Pages list', function() {
      var pages;
      pages = request = null;
      beforeEach(function() {
        pages = api.pageList();
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.page_list.success);
      });
      return it('fetches all pages', function() {
        expect(request.url).toEqual("" + api.url + "get_page_index/");
        return expect(pages.length).toBeGreaterThan(0);
      });
    });
  });
}).call(this);
