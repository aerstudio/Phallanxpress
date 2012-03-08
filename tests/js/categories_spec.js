(function() {
  describe("Phallanxpress categories collection", function() {
    var api, request;
    request = api = null;
    beforeEach(function() {
      jasmine.Ajax.useMock();
      return api = new Phallanxpress.Api('http://domain.com');
    });
    return describe('Categories list', function() {
      var categories;
      categories = request = null;
      beforeEach(function() {
        categories = api.categoryList({
          taxonomy: 'cat'
        });
        request = mostRecentAjaxRequest();
        return request.response(TestResponses.category_list.success);
      });
      it('fetches all categories', function() {
        expect(request.url).toEqual("" + api.url + "get_category_index/?taxonomy=cat");
        return expect(categories.length).toBeGreaterThan(0);
      });
      it('selects top categories', function() {
        var top;
        top = categories.topCategories();
        expect(top.length).toBeLessThan(categories.length);
        return top.each(function(cat) {
          return expect(cat.get('parent')).toEqual(0);
        });
      });
      return describe('Category Model', function() {
        return it('fetches all children', function() {
          var cat, cats;
          cat = categories.get(36);
          cats = cat.children();
          return expect(cats.length).toBeGreaterThan(0);
        });
      });
    });
  });
}).call(this);
