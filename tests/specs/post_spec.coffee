describe "Phallanxpress Post Model", ->

  post = null

  beforeEach ->
    jasmine.Ajax.useMock()
    post = new Phallanxpress.Post(id: 1)


  describe 'Unit tests', ->

    it 'throws an error if not defined apiURL', ->
      expect(-> post.fetch()).toThrow('An api URL must be defined')

  describe 'Fetching', ->

    beforeEach ->
      post.apiUrl = 'http://domain.com/'

    it 'fetches a post given an id', ->
      post.fetch()
      expect(mostRecentAjaxRequest().url).toEqual("#{post.apiUrl}get_post/?id=1")

    it 'fetches a post given a slug', ->
      post.id = null
      post.set('slug', 'test-slug')
      post.fetch()  
      expect(mostRecentAjaxRequest().url).toEqual("#{post.apiUrl}get_post/?slug=test-slug")