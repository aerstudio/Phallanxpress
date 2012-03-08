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
  describe("Phallanxpress page model", function() {
    var page, request;
    request = page = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return page = new Phallanxpress.Page({
        id: 1
      });
    });
    describe('Unit tests', function() {
      return it('throws an error if not defined apiURL', function() {
        return expect(function() {
          return page.fetch();
        }).toThrow('An api URL must be defined');
      });
    });
    return describe('Fetching', function() {
      beforeEach(function() {
        return page.apiUrl = 'http://domain.com/';
      });
      it('fetches a page given an id', function() {
        page.fetch();
        request = mostRecentAjaxRequest();
        request.response(TestResponses.page.success);
        expect(request.url).toEqual("" + page.apiUrl + "get_page/?id=1");
        return expect(page.get('content')).toBeDefined();
      });
      return it('fetches a page given a slug', function() {
        page.id = null;
        page.set('slug', 'test-slug');
        page.fetch();
        return expect(mostRecentAjaxRequest().url).toEqual("" + page.apiUrl + "get_page/?slug=test-slug");
      });
    });
  });
}).call(this);
