
class Phallanxpress.Storage 

  expireTime: 24 # Expiring time in hours

  constructor: (@name, session = false)->
    do @enable session

  enable: (session = false) ->
    return if not window? and not window.localStorage and not window.sessionStorage
    if session
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
    catch error
      if error is QUOTA_EXCEEDED_ERR
        return 
      else
        throw error
    collection.each( (model)=>
      @saveModel model
    )
    
  saveModel:(model)->
    return unless @storage?
    now = new Date()
    model.set phallanxTimestamp: now.getTime(), silent: true
    try 
      @storage.setItem @name+model.constructor.name.toLowerCase()+'/'+model.id, JSON.stringify(model)
    catch error
      if error is QUOTA_EXCEEDED_ERR
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
        @destroyCollection collection
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
    JSON.parse @storage.getItem @name+modelName.toLowerCase()+'/'+id

  destroyCollection: (collection)->
    return unless @storage?
    @storage.removeItem collection.url





