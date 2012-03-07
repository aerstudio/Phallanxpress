 #
 #  Page.
 #
 #  Created by hector spc <hector@aerstudio.com>
 #  Aer Studio 
 #  http://www.aerstudio.com
 #
 #  Sun Mar 04 2012
 #
 #  collections/pages_collection.js.coffee
 #

class Phallanxpress.Pages extends Phallanxpress.Collection

  model: Phallanxpress.Page

  parseTag: 'pages'

  pageList: (options)->
    @_wpAPI('get_page_index', options)

  