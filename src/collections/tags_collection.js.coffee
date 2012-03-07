 #
 #  Tag.
 #
 #  Created by hector spc <hector@aerstudio.com>
 #  Aer Studio 
 #  http://www.aerstudio.com
 #
 #  Sun Mar 04 2012
 #
 #  collections/tags_collection.js.coffee
 #

class Phallanxpress.Tags extends Phallanxpress.Collection

  model: Phallanxpress.Tag
  parseTag: 'tags'

  tagList: (options)->
    @_wpAPI('get_tag_index', options)

  
  
