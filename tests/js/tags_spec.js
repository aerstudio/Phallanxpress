(function() {
  describe("Phallanxpress tags collection", function() {
    var api, request;
    request = api = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return api = new Phallanxpress.Api('http://domain.com');
    });
    return describe('Tags list', function() {
      var tags;
      tags = request = null;
      beforeEach(function() {
        tags = api.tagList();
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.tag_list.success);
      });
      return it('fetches all tags', function() {
        expect(request.url).toEqual("" + api.url + "get_tag_index/");
        return expect(tags.length).toBeGreaterThan(0);
      });
    });
  });
}).call(this);
