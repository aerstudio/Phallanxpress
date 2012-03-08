root = this;

previousPhallanxpress = root.Phallanxpress


if typeof exports isnt 'undefined'
  Phallanxpress = exports
else 
  Phallanxpress = root.Phallanxpress = {}

Phallanxpress.VERSION = '0.1.0'

_ = root._
_ = require('underscore') if not _ and typeof require isnt 'undefined'

Backbone = root.Backbone;
Backbone = require('backbone') if not Backbone and typeof require isnt 'undefined'

$ = root.jQuery || root.Zepto || root.ender

Phallanxpress.noConflict = ->
  root.Phallanxpress = previousPhallanxpress
  this
  

