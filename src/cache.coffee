
class Phallanxpress.Cache 

  expireTime: 24 # Expiring time in hours

  constructor: (@name)->
    _.extend(this, Backbone.Events)
    do @enable 
    @objects = (JSON.parse @storage.getItem @name) || []

  enable: (options = {}) ->
    return if not window? and not window.localStorage and not window.sessionStorage
    if options.sessionStorage
      @storage = window.sessionStorage
    else
      @storage = window.localStorage

  disable: ->
    @storage = null


  saveCollection: (collection)->
    return if collection.length is 0 or not @storage?
    col =
      ids: collection.pluck 'id'
      timestamp: new Date().getTime()
    try 
      @storage.setItem collection.url, JSON.stringify(col)
      collection.each( (model)=>
        @saveModel model
      )
      @saveId collection.url
    catch error
      if error is QUOTA_EXCEEDED_ERR
        do @cleanStorage
        @trigger('quota exceeded')
        return 
      else
        throw error
   
    
  saveModel:(model)->
    return unless @storage?
    now = new Date()
    model.set phallanxTimestamp: now.getTime(), silent: true
    try 
      id = @name+model.constructor.name.toLowerCase()+'/'+model.id
      @storage.setItem id, JSON.stringify(model)
      @saveId id
    catch error
      if error is QUOTA_EXCEEDED_ERR
        do @cleanStorage
        @trigger('quota exceeded')
        return 
      else
        throw error

  getCollection: (collection) ->
    return false unless @storage?
    col = JSON.parse @storage.getItem collection.url
    if col? 
      elapsedTime = new Date().getTime() - col.timestamp
      if elapsedTime < @expireTime * 3600000
        modelName = (new collection.model()).constructor.name
        models = _.map(col.ids, (id)=>
          attributes = @getModelAttributes id, modelName
        )
        if collection.options.add
          collection.add models, silent: true
        else
          collection.reset models, silent: true
        true
      else
        false
    else
      false

  getModel: (model) ->
    attr = @getModelAttributes model.id, model.constructor.name
    return false unless attr? or @storage?
    if attr.phallanxTimestamp?
      timestamp = +attr.phallanxTimestamp || 0
      delete attr.phallanxTimestamp
      elapsedTime = new Date().getTime() - timestamp
      if elapsedTime < @expireTime * 3600000
        model.set attr, silent: true
        true
      else
       false
    else
      false

  getModelAttributes: (id, modelName)->
    return null unless @storage?
    JSON.parse @storage.getItem @name+modelName.toLowerCase()+'/'+id

  saveId: (id)->
    return unless @storage?
    unless _.include(@objects, id)
      @objects.push(id)
      @storage.setItem @name, JSON.stringify @objects

  cleanStorage: (forceCleanAll = false)->
    removedIds = []
    _.each(@objects, (id)=>
      data = JSON.parse @storage.getItem id
      elapsedTime = new Date().getTime() - (data.timestamp || data.phallanxTimestamp)
      if elapsedTime > @expireTime * 3600000 or forceCleanAll
        @storage.removeItem id
        removedIds.push id
    )
    @objects =_.difference(@objects, removedIds)
    if @objects.length > 0
      @storage.setItem @name, JSON.stringify @objects    
    else
      @storage.removeItem @name
    
    


