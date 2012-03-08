
class Phallanxpress.Api

  constructor: (@url)->
    
    Phallanxpress.apiURL = @url

    a = document.createElement 'a'
    a.href = @url
    dnsprefetch = "<link rel=\"dns-prefetch\" href=\"#{a.protocol}//#{a.hostname}\">"
    $('head').append dnsprefetch

  recentPosts: (options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    view = @_bindView posts, options.view
    posts.recentPosts options
    if view?
      view
    else
      posts

  searchPosts: (query, options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    view = @_bindView posts, options.view
    posts.searchPosts query, options
    if view?
      view
    else
      posts

  datePosts: (query, options)->
    options ||= {}
    posts = new Phallanxpress.Posts
    view = @_bindView posts, options.view
    posts.datePosts query, options
    if view?
      view
    else
      posts

  post:(id, options)->
    options ||= {}
    post = new Phallanxpress.Post
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
    view = @_bindView pages, options.view
    pages.pageList(options)
    if view?
      view
    else
      pages

  page:(id, options)->
    options ||= {}
    page = new Phallanxpress.Page
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
    view = @_bindView categories, options.view
    categories.categoryList(options)
    if view?
      view
    else
      categories


  categoryPosts: (id, options)->
    posts = new Phallanxpress.Posts
    view = @_bindView posts, options.view
    posts.categoryPosts id, options
    if view?
      view
    else
      posts

  tagList: (options)->
    options ||= {}
    tags = new Phallanxpress.Tags
    view = @_bindView tags, options.view
    tags.tagList(options)
    if view?
      view
    else
      tags


  tagPosts: (id, options)->
    posts = new Phallanxpress.Posts
    view = @_bindView posts, options.view
    posts.tagPosts id, options
    if view?
      view
    else
      posts

  authorList: (options)->
    options ||= {}
    authors = new Phallanxpress.Authors
    view = @_bindView authors, options.view
    authors.authorList(options)
    if view?
      view
    else
      authors

  authorPosts: (id, options)->
    posts = new Phallanxpress.Posts
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
