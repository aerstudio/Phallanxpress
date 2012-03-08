describe "Phallanxpress APi", ->

  api = null

  url = 'http://domain.com/api/'

  beforeEach ->
    api = new Phallanxpress.Api(url)
    
  it "throws an exception if there isnt a url defined", ->
    expect(-> new Phallanxpress.Api()).toThrow('URL must be defined')

  it "has the right url", ->
    expect(api.url).toEqual url

  it "has a trailing slash url", ->
    url = 'http://domain.com/api'
    api = new Phallanxpress.Api(url)
    expect(api.url.slice(-1)).toEqual('/')

  it "inserts link dns-prefetch tag", ->
    linkTags = $('link[href="http://domain.com"][rel=dns-prefetch]')
    expect(linkTags.length).toEqual(1)