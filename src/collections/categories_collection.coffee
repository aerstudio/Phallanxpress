 #
 #  Category.
 #
 #  Created by hector spc <hector@aerstudio.com>
 #  Aer Studio 
 #  http://www.aerstudio.com
 #
 #  Sun Mar 04 2012
 #
 #  collections/categories_collection.js.coffee
 #

class Phallanxpress.Categories extends Phallanxpress.Collection

  model: Phallanxpress.Category

  parseTag: 'categories'

  categoryList: (options)->
    @_wpAPI('get_category_index', options)

  topCategories: ()->
    top = @filter( (model)->
      model.get('parent') is 0
    )
    new Phallanxpress.Categories(top)


