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
    throw new Error('An api URL must be defined') unless @apiUrl?
    throw new Error('An api command must be defined') unless @apiCommand?

    if @has('slug')
      url = "#{@apiUrl}#{@apiCommand}/?slug=#{@get('slug')}"
    else if @id?
      url = "#{@apiUrl}#{@apiCommand}/?id=#{@id}"
    url += '&post_type=#{@post_type}' if @postType?
    url += '&taxonomy=@{@taxonomy}' if @taxonomy?
    url

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
