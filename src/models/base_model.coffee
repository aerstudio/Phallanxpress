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

  apiCommand: ''
  parseTag: ''

  url: ->
    if @has('slug')
      url = "#{Phallanxpress.apiURL}#{apiCommand}/?slug=#{@get('slug')}"
    else if @id?
      url = "#{Phallanxpress.apiURL}#{apiCommand}/?id=#{@id}"
    url += '&post_type=#{@post_type}' if @postType?
    url += '&taxonomy=@{@taxonomy}' if @taxonomy?
    url

  parse:(resp, xhr)->
    if resp.status is 'ok'
      return resp[@parseTag] 
    else
      resp

  # Disabling save method
  save: ->
