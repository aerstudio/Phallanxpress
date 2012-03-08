
class Phallanxpress.Storage 

  expireTime: 24 # Expiring time in hours

  constructor: (@name)->

  saveCollection: (collection)->
    return if collection.length is 0
    col =
      ids: collection.pluck 'id'
      timestamp: new Date().getTime()
    localStorage.setItem collection.url, JSON.stringify(col)
    collection.each( (model)=>
      @saveModel model
    )

    
  saveModel:(model)->
    now = new Date()
    model.set phallanxTimestamp: now.getTime(), silent: true
    localStorage.setItem @name+model.constructor.name.toLowerCase()+'/'+model.id, JSON.stringify(model)

  getCollection: (collection) ->
    col = JSON.parse localStorage.getItem collection.url
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
    return false unless attr?
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
    JSON.parse localStorage.getItem @name+modelName.toLowerCase()+'/'+id

  destroyCollection: (collection)->
    localStorage.removeItem collection.url





