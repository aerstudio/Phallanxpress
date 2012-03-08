 #
 #  Post.
 #
 #  Created by hector spc <hector@aerstudio.com>
 #  Aer Studio 
 #  http://www.aerstudio.com
 #
 #  Wed Feb 22 2012
 #
 #  collections/posts_collection.js.coffee
 #

class Phallanxpress.Posts extends Phallanxpress.Collection

  model: Phallanxpress.Post

  parseTag: 'posts'

  defaultCount: 32

  recentPosts: (options)->
    @_wpAPI('get_recent_posts', @_pageOptions(null, options))

  categoryPosts: (id, options)->
    @_wpAPI('get_category_posts', @_pageOptions(id, options))

  authorPosts: (id, options)->
    @_wpAPI('get_author_posts', @_pageOptions(id, options))

  tagPosts: (id, options)->
    @_wpAPI('get_tag_posts', @_pageOptions(id, options))

  searchPosts: (query, options)->
    options = @_pageOptions(null, options)
    options.params.search = query
    @_wpAPI('get_search_results', options)

  datePosts: (date, options)->
    options = @_pageOptions(null, options)
    options.params.date = date
    @_wpAPI('get_date_posts', options)

  pageUp: (options)->
    @toPage(@page+1, options)

  pageDown: (options)->
    @toPage(@page-1, options)
    

  toPage: (page, options)->
    options = options && _.clone(options) || {}
    options = _.defaults(options, @options) if @options?
    if page? and page >= 1 and page <= @pages
      options.page = page
      @_wpAPI(@currentCommand, @_pageOptions(@apiObject, options))
    else
      false    

  _pageOptions: (id, options)->
    options = options && _.clone(options) || {}
    options.params = options.params || {}
    if id?
      @apiObject = id
      if _.isNumber(id) 
        options.params.id = id
      else if _.isString(id)
        options.params.slug = id
      else if id.id?
        options.params.id = id.id
    options.params.count = options.count || @defaultCount
    @page = options.page || 1
    options.params.page = @page
    options

  parse: (resp, xhr)->
    if resp.status is 'ok'
      @count_total = resp.count_total
      @pages = resp.pages
      @count = resp.count
      if @count_total is 0
        @trigger('no posts', resp, xhr)
        null
      else
        resp.posts
    else
      @trigger('error', resp.error, resp, xhr)
      null
    
  

