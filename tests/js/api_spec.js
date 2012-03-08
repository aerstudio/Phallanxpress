(function() {
  describe("Phallanxpress APi", function() {
    var api, url;
    api = null;
    url = 'http://domain.com/api/';
    beforeEach(function() {
      return api = new Phallanxpress.Api(url);
    });
    it("throws an exception if there isnt a url defined", function() {
      return expect(function() {
        return new Phallanxpress.Api();
      }).toThrow('URL must be defined');
    });
    it("has the right url", function() {
      return expect(api.url).toEqual(url);
    });
    it("has a trailing slash url", function() {
      url = 'http://domain.com/api';
      api = new Phallanxpress.Api(url);
      return expect(api.url.slice(-1)).toEqual('/');
    });
    return it("inserts link dns-prefetch tag", function() {
      var linkTags;
      linkTags = $('link[href="http://domain.com"][rel=dns-prefetch]');
      return expect(linkTags.length).toEqual(1);
    });
  });
}).call(this);
