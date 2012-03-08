describe "Phallanxpress tags collection", ->

  request = api = null

  beforeEach ->
    jasmine.Ajax.useMock()
    api = new Phallanxpress.Api('http://domain.com')


  describe 'Tags list', ->
    tags = request = null
    beforeEach ->
      tags = api.tagList()
      request = mostRecentAjaxRequest()
      request.response TestResponses.tag_list.success

    it 'fetches all tags', ->
      expect(request.url).toEqual("#{api.url}get_tag_index/")
      expect(tags.length).toBeGreaterThan 0




