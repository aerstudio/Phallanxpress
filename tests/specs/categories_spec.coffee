describe "Phallanxpress categories collection", ->

  request = api = null

  beforeEach ->
    jasmine.Ajax.useMock()
    api = new Phallanxpress.Api('http://domain.com')


  describe 'Categories list', ->
    categories = request = null
    beforeEach ->
      categories = api.categoryList( taxonomy: 'cat', forceRequest: true)
      request = mostRecentAjaxRequest()
      request.response TestResponses.category_list.success

    it 'fetches all categories', ->
      expect(request.url).toEqual("#{api.url}get_category_index/?taxonomy=cat")
      expect(categories.length).toBeGreaterThan 0

    it 'selects top categories', ->
      top = categories.topCategories()
      expect(top.length).toBeLessThan categories.length
      top.each( (cat)->
        expect(cat.get('parent')).toEqual(0)
      )

    describe 'Category Model', ->

      it 'fetches all children', ->
        cat = categories.get(36)

        cats = cat.children()
        
        expect(cats.length).toBeGreaterThan 0



