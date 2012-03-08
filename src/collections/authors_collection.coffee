 #
 #  Author.
 #
 #  Created by hector spc <hector@aerstudio.com>
 #  Aer Studio 
 #  http://www.aerstudio.com
 #
 #  Sun Mar 04 2012
 #
 #  collections/authors_collection.js.coffee
 #

class Phallanxpress.Authors extends Phallanxpress.Collection

  model: Phallanxpress.Author
  parseTag: 'authors'

  authorList: (options)->
    @_wpAPI('get_author_index', options)

  
  
