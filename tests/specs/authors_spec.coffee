describe "Phallanxpress authors collection", ->

  request = api = null

  beforeEach ->
    jasmine.Ajax.useMock()
    api = new Phallanxpress.Api('http://domain.com')


  describe 'Authors list', ->
    authors = request = null
    beforeEach ->
      authors = api.authorList(forceRequest: true)
      request = mostRecentAjaxRequest()
      request.response TestResponses.author_list.success

    it 'fetches all authors', ->
      expect(request.url).toEqual("#{api.url}get_author_index/")
      expect(authors.length).toBeGreaterThan 0




