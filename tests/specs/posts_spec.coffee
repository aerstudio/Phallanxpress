describe "Phallanxpress posts collection", ->

  request = fakeResponse = api = null

  beforeEach ->
    jasmine.Ajax.useMock()
    api = new Phallanxpress.Api('http://domain.com')
    fakeResponse = TestResponses.posts

  it "gets recent posts", ->
    posts = api.recentPosts()

    posts.on('reset', ->
      console.log posts
    )

  it "gets associated with a view", ->
    view = api.recentPosts( view: Backbone.View )
    spyOn(view.render)
    expect(view.render).toHaveBeenCalled()