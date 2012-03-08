 #
 #  Collection.
 #
 #  Created by hector spc <hector@aerstudio.com>
 #  Aer Studio 
 #  http://www.aerstudio.com
 #
 #  Sun Mar 04 2012
 #
 #  collections/collections_collection.js.coffee
 #
class Phallanxpress.Collection extends Backbone.Collection

  getBySlug: (slug)->
    models = @filter( (model)->
      model.get('slug') is slug
    )
    switch models.length
      when 1 then return models[0]
      when 0 then return null
      else throw new Error('More than one post with the same slug')

  _wpAPI: (cmd, options)->
    
    throw new Error('An api command must be defined') unless cmd?
    throw new Error('An api URL must be defind') unless @apiUrl?
    @isLoading = true
    options = options && _.clone(options) || {}
    url = @apiUrl
    url += cmd+'/'
    options.params = options.params || {}
    @currentCommand = cmd
    post_type = options.post_type or @postType
    options.params['post_type'] = post_type if post_type?
    options.params['custom_fields'] = @customFields if @customFields
    taxonomy = options.taxonomy or @taxonomy
    options.params['taxonomy'] = taxonomy if taxonomy
    url += '?'+$.param(options.params) unless _.isEmpty(options.params)
    
    
    @currentParams = options.params

    @url = url

    success = options.success;
    options.success = (resp, status, xhr) =>
      @isLoading = false
      success this, resp if success?
    
    # Cleaning for new request
    # and calling reset to redraw
    @options = _.clone(options)
    delete @options.success
    unless options.add
      do @reset 

    @fetch(options)

    this

  resetVars: ->
    @page = @pages = @count = @count_total = null
    

  parse: (resp, xhr)->
    return resp[@parseTag] if resp.status is 'ok'
    
    @trigger('error', resp.error, resp, xhr)      
    null

  # Disabling save method

  save: ->
