 #
 #  Category.
 #
 #  Created by hector spc <hector@aerstudio.com>
 #  Aer Studio 
 #  http://www.aerstudio.com
 #
 #  Sun Mar 04 2012
 #
 #  models/category_model.js.coffee
 #

class Phallanxpress.Category extends Phallanxpress.Model

  children: ->
    @collection.filter( (model)=>
      model.get('parent') is @id
    )

  posts: (options)->
    posts = new Phallanxpress.Posts
    posts.get_category_posts( id: @id)
    posts





