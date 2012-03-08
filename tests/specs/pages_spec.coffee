describe "Phallanxpress pages collection", ->

  request = api = null

  beforeEach ->
    jasmine.Ajax.useMock()
    api = new Phallanxpress.Api('http://domain.com')


  describe 'Pages list', ->
    pages = request = null
    beforeEach ->
      pages = api.pageList()
      request = mostRecentAjaxRequest()
      request.response TestResponses.page_list.success

    it 'fetches all pages', ->
      expect(request.url).toEqual("#{api.url}get_page_index/")
      expect(pages.length).toBeGreaterThan 0



describe "Phallanxpress page model", ->

  request = page = null

  beforeEach ->
    jasmine.Ajax.useMock()
    page = new Phallanxpress.Page(id: 1)
    
  describe 'Unit tests', ->

    it 'throws an error if not defined apiURL', ->
      expect(-> page.fetch()).toThrow('An api URL must be defined')

  describe 'Fetching', ->

    beforeEach ->
      page.apiUrl = 'http://domain.com/'

    it 'fetches a page given an id', ->
      page.fetch()
      request = mostRecentAjaxRequest()
      request.response TestResponses.page.success
      expect(request.url).toEqual("#{page.apiUrl}get_page/?id=1")
      expect(page.get('content')).toBeDefined()

    it 'fetches a page given a slug', ->
      page.id = null
      page.set('slug', 'test-slug')
      page.fetch()  
      expect(mostRecentAjaxRequest().url).toEqual("#{page.apiUrl}get_page/?slug=test-slug")




