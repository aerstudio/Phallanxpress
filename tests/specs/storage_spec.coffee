describe 'Phallanxpress storage', ->

  api = request = null

  beforeEach ->
    jasmine.Ajax.useMock()
    api = new Phallanxpress.Api('http://aerstudio.com')


  describe "Enable / Disable", ->

    posts = numRequests = null

    beforeEach ->
      numRequests = ajaxRequests.length
      posts = api.recentPosts(forceRequest: true, params: { custom_fields: "e1,f2"})
      request = mostRecentAjaxRequest()
      request.response TestResponses.posts.success
    
    it "disables the cache", ->
      do api.cache.disable
      request.url += 'e'
      numRequests = ajaxRequests.length
      posts = api.recentPosts(params: { custom_fields: "e1,f2"})
      expect(ajaxRequests.length).toEqual numRequests + 1
      expect(mostRecentAjaxRequest().url).toEqual posts.url

    it "enables the cache", ->
      do api.cache.enable
      request = mostRecentAjaxRequest()
      request.url += 'e'
      numRequests = ajaxRequests.length
      posts = api.recentPosts(params: { custom_fields: "e1,f2"})
      expect(ajaxRequests.length).toEqual numRequests
      expect(mostRecentAjaxRequest().url).not.toEqual posts.url

  describe "Collections", ->

    posts = numRequests = null

    beforeEach ->
      numRequests = ajaxRequests.length
      posts = api.recentPosts(forceRequest: true, params: { custom_fields: "f1,f2"})
      request = mostRecentAjaxRequest()
      request.response TestResponses.posts.success
      
    it "forces the request", ->
      expect(ajaxRequests.length).toEqual numRequests + 1
      expect(request.url).toEqual posts.url

    it "gets data from storage", ->
      posts = api.recentPosts(params: { custom_fields: "d1,d2"}, forceRequest: true)
      request = mostRecentAjaxRequest()
      request.response TestResponses.posts.success
      length = posts.length
      models = posts.pluck('id')
      posts.reset()
      expect(posts.length).toEqual 0
      request.url +='d'
      
      numRequests = ajaxRequests.length
      posts = api.recentPosts(params: { custom_fields: "d1,d2"})
      expect(posts.length).toEqual length
      expect(ajaxRequests.length).toEqual numRequests
      expect(mostRecentAjaxRequest().url).not.toEqual posts.url
      expect(posts.pluck('id')).toEqual models

    it "triggers reset event", ->
      
      render = jasmine.createSpy('render')
      view = new Backbone.View
      view.render = render
      v = api.recentPosts( view: view , params: { custom_fields: "f1,f2"})
      
      expect(render).toHaveBeenCalled()

    it "triggers add event", ->
      render = jasmine.createSpy('render')
      view = new Backbone.View
      view.render = render
      v = api.recentPosts( view: view , add: true, params: { custom_fields: "f1,f2"})
      
      expect(render).toHaveBeenCalled()      

    it "makes a request if expired", ->
      runs ->
        numRequests = ajaxRequests.length
        api.cache.expireTime = 1 / 3600000 * 10
        posts = api.recentPosts( forceRequest: true, params: { custom_fields: "f6,f2"})
        expect(ajaxRequests.length).toEqual numRequests + 1
        request = mostRecentAjaxRequest()
        request.response TestResponses.posts.success
        request.url += 'd'

      waits(20)

      runs ->
        numRequests = ajaxRequests.length
        posts = api.recentPosts(params: { custom_fields: "f6,f2"})
        expect(ajaxRequests.length).toEqual numRequests + 1
        expect(mostRecentAjaxRequest().url).toEqual posts.url

  describe "Models", ->
    
    post = null

    beforeEach ->
      post = api.post(1318, forceRequest: true)
      request = mostRecentAjaxRequest()
      request.response TestResponses.post.success
      
    it "forces the request", ->
      expect(request.url).toEqual("#{api.url}get_post/?id=#{post.id}")

    it "gets data from storage", ->
      slug = post.get('slug')
      numRequests = ajaxRequests.length
      
      post = api.post(1318)
      expect(ajaxRequests.length).toEqual numRequests
      expect(post.get('slug')).toEqual slug
      expect(post.get('phallanxTimestamp')).toBeUndefined()

    it "make a request if expired", ->
      url = null
      runs ->
        numRequests = ajaxRequests.length
        post = api.post(1318, forceRequest: true)
        api.cache.expireTime = 1 / 3600000 * 10
        expect(ajaxRequests.length).toEqual numRequests + 1
        request = mostRecentAjaxRequest()
        request.response TestResponses.post.success
        url = request.url
        request.url += 'd'

      waits(20)

      runs ->
        numRequests = ajaxRequests.length
        post = api.post(1318)
        expect(ajaxRequests.length).toEqual numRequests + 1
        expect(mostRecentAjaxRequest().url).toEqual url



