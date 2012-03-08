describe "Phallanxpress posts collection", ->

  api = null

  beforeEach ->
    jasmine.Ajax.useMock()
    api = new Phallanxpress.Api('http://www.p-pi.org/blog/api/')


  it "gets recent posts", ->
    posts = api.recentPosts()

    posts.on('reset', ->
      console.log posts
    )

  it "gets associated with a view", ->
    view = api.recentPosts( view: Backbone.View )
    spyOn(view.render)
    expect(view.render).toHaveBeenCalled()