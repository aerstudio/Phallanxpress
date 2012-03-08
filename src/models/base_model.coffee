 #
 #  WP Model.
 #
 #  Created by hector spc <hector@aerstudio.com>
 #  Aer Studio 
 #  http://www.aerstudio.com
 #
 #  Sun Mar 04 2012
 #
 #  models/wp_model.js.coffee
 #

class Phallanxpress.Model extends Backbone.Model


  url: ->

    throw new Error('An api command must be defined') unless @apiCommand?
    throw new Error('An api or apiUrl must be defined') unless @apiUrl? or @api?
    rootUrl = @apiUrl || @api.url
    if @id?
      url = "#{rootUrl}#{@apiCommand}/?id=#{@id}"
    else if @has('slug')
      url = "#{rootUrl}#{@apiCommand}/?slug=#{@get('slug')}"
    
    url += '&post_type=#{@post_type}' if @postType?
    url += '&taxonomy=@{@taxonomy}' if @taxonomy?
    url

  fetch: (options)->
    options = options || {}
    forced = options.forceRequest || false

    if @api? and not forced  
      fetched = @api.storage.getModel this

    if not fetched
      super 
    else
      @trigger('change', this, options) unless options.silent
      options.success this, null if options.success?

    this

  parse:(resp, xhr)->
    if resp.status is 'ok'
      if _.isEmpty(@parseTag)
        return resp
      else
        return resp[@parseTag] 
    else
      resp

  # Disabling save method
  save: ->
