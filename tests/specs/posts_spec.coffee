describe "Phallanxpress posts collection", ->

  request = api = null

  beforeEach ->
    jasmine.Ajax.useMock()
    api = new Phallanxpress.Api('http://domain.com')
    

  describe 'URL building', ->

    it "builds the right url by default", ->
      posts = api.recentPosts()
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_recent_posts/?count=#{posts.defaultCount}&page=#{posts.page}")

    it "builds the right url with options, post types and taxonomies", ->
      posts = api.recentPosts( taxonomy: 'new_tax', postType: 'type', params: {custom_fiels: 'field1,field2'})
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_recent_posts/?custom_fiels=field1%2Cfield2&count=32&page=1&post_type=type&taxonomy=new_tax")  

    it " builds url with id if a number is passed", ->
      posts = api.categoryPosts(7)
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_category_posts/?id=7&count=32&page=1")

    it " builds url with slug if a string is passed", ->
      posts = api.categoryPosts('cat1')
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_category_posts/?slug=cat1&count=32&page=1")

    it " builds url with id if a model is passed", ->
      cat = new Phallanxpress.Category( id: 7)
      posts = api.categoryPosts(cat)
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_category_posts/?id=7&count=32&page=1")

  describe 'Pagination', ->

    it "gets the next page", ->
      posts = api.recentPosts(count: 2)
      posts.pageUp()
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_recent_posts/?count=2&page=2")        

    it "gets the previous page", ->
      posts = api.recentPosts(taxonomy: 'cat', page: 2)
      posts.pageDown()
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_recent_posts/?count=32&page=1&taxonomy=cat")  

    it "gets a given page", ->
      posts = api.recentPosts(taxonomy: 'cat', postType: 'type', page: 2)
      posts.toPage(4)
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_recent_posts/?count=32&page=4&post_type=type&taxonomy=cat")    

    it "adds the next page to current results", ->
      posts = api.recentPosts()
      request = mostRecentAjaxRequest()
      request.response TestResponses.posts.success
      posts.pageUp(add: true)
      request = mostRecentAjaxRequest()
      request.response TestResponses.posts.page2
      expect(posts.length).toEqual(7)        


  describe 'Fetching posts', ->
    posts = null

    beforeEach ->
      posts = api.recentPosts()
      request = mostRecentAjaxRequest()
      request.response TestResponses.posts.success

    it 'gets the posts', ->
      expect(posts.length).toEqual(5);

    it 'triggers a no posts event', ->
      no_posts = jasmine.createSpy('no posts')
      posts = api.searchPosts('no key')
      posts.on('no posts', no_posts)
      request = mostRecentAjaxRequest()
      request.response TestResponses.posts.not_found      
      expect(no_posts).toHaveBeenCalled()

    it 'triggers an error event', ->
      error = jasmine.createSpy('error')
      posts = api.searchPosts('no key')
      posts.on('error', error)
      request = mostRecentAjaxRequest()
      request.response TestResponses.posts.error      
      expect(error).toHaveBeenCalled()

    it 'has the right length', ->
      expect(posts.length).toEqual(posts.count);

    it 'has all the pagination metadata', ->
      expect(posts.count_total).toBeDefined()
      expect(posts.page).toEqual(1)
      expect(posts.pages).toBeDefined()
      posts.pageUp()
      expect(posts.page).toEqual(2)

    it 'gets a post by slug', ->
      expect(posts.getBySlug('test-slug')).toBeDefined()

    it 'associated with a view if passed the object', ->
      render = jasmine.createSpy('render')
      View = Backbone.View.extend(
        initialize: ->
          this.render = render
          this.collection.on('reset', this.render, this)
          
      )
      v = api.recentPosts( view: View )
      
      expect(render).toHaveBeenCalled()

    it 'associated with a view if passed an instance', ->
      render = jasmine.createSpy('render')
      view = new Backbone.View
      view.render = render
      v = api.recentPosts( view: view )
      
      expect(render).toHaveBeenCalled()

  describe 'Fetching methods', ->

    it 'gets search posts', ->
      posts = api.searchPosts('query')
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_search_results/?count=32&page=1&search=query")  

    it 'gets author posts', ->
      posts = api.authorPosts('cristina')
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_author_posts/?slug=cristina&count=32&page=1")   

    it 'gets tag posts', ->
      posts = api.tagPosts('javascript')
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_tag_posts/?slug=javascript&count=32&page=1")

    it 'gets category posts', ->
      posts = api.categoryPosts(7, taxonomy: 'cat', postType: 'type')
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_category_posts/?id=7&count=32&page=1&post_type=type&taxonomy=cat")         
    
    it 'gets date posts', ->
      posts = api.datePosts('2012-03-07')
      expect(mostRecentAjaxRequest().url).toEqual("#{api.url}get_date_posts/?count=32&page=1&date=2012-03-07")         


