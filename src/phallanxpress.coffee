
class Phallanxpress.Api

  constructor: (@url)->
    
    throw new Error('URL must be defined') unless @url?

    @url += '/' if @url.slice(-1) isnt '/'

    if window?
      a = document.createElement 'a'
      a.href = @url
      dnsprefetch = "<link rel=\"dns-prefetch\" href=\"#{a.protocol}//#{a.hostname}\">"
      
      linkTags = $("link[href*=\"#{a.protocol}//#{a.hostname}\"][rel=dns-prefetch]")

      $('head').append dnsprefetch if linkTags.length is 0

    @storage = new Phallanxpress.Storage(@url)

  recentPosts: (options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    posts.api = this
    view = @_bindView posts, options.view
    posts.recentPosts options
    if view?
      view
    else
      posts

  searchPosts: (query, options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    posts.api = this
    view = @_bindView posts, options.view
    posts.searchPosts query, options
    if view?
      view
    else
      posts

  datePosts: (query, options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    posts.api = this
    view = @_bindView posts, options.view
    posts.datePosts query, options
    if view?
      view
    else
      posts

  post:(id, options)->
    options ||= {}
    post = new Phallanxpress.Post
    post.api = this
    if _.isNumber id
      post.id = id
    else if _.isString id
      post.set slug: id
    else
      throw new Error 'id must be a number or a string for a slug'
    view = @_bindView post, options.view
    post.postType = options.postType if options.postType?
    post.fetch options
    if view?
      view
    else
      post

  pageList: (options)->
    options ||= {}
    pages = new Phallanxpress.Pages
    pages.api = this
    view = @_bindView pages, options.view
    pages.pageList(options)
    if view?
      view
    else
      pages

  page:(id, options)->
    options ||= {}
    page = new Phallanxpress.Page
    page.api = this
    if _.isNumber id
      page.id = id
    else if _.isString id
      page.set slug: id 
    else
      throw new Error 'id must be a number or a string for a slug'
    view = @_bindView page, options.view
    page.fetch options
    if view?
      view
    else
      page

  categoryList: (options)->
    options ||= {}
    categories = new Phallanxpress.Categories
    categories.api = this
    view = @_bindView categories, options.view
    categories.categoryList(options)
    if view?
      view
    else
      categories


  categoryPosts: (id, options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    posts.api = this
    view = @_bindView posts, options.view
    posts.categoryPosts id, options
    if view?
      view
    else
      posts

  tagList: (options)->
    options ||= {}
    tags = new Phallanxpress.Tags
    tags.api = this
    view = @_bindView tags, options.view
    tags.tagList(options)
    if view?
      view
    else
      tags


  tagPosts: (id, options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    posts.api = this
    view = @_bindView posts, options.view
    posts.tagPosts id, options
    if view?
      view
    else
      posts

  authorList: (options)->
    options ||= {}
    authors = new Phallanxpress.Authors
    authors.api = this
    view = @_bindView authors, options.view
    authors.authorList(options)
    if view?
      view
    else
      authors

  authorPosts: (id, options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    posts.api = this
    view = @_bindView posts, options.view
    posts.authorPosts id, options
    if view?
      view
    else
      posts

  _bindView:(obj, view)->
    if view? 
      if view instanceof Backbone.View
        v = view
        if obj instanceof Backbone.Collection
          v.obj = obj
          if _.isFunction v.render
            obj.on('reset', v.render, v)
            obj.on('add', v.render, v)
        else
          v.model = obj
          if _.isFunction v.render
            obj.on('change', v.render, v)
      else if _.isFunction view
        if obj instanceof Backbone.Collection
          v = new view collection: obj
        else
          v = new view model: obj
      else
        return null
      v
    else
      null
