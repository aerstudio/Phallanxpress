# global object. window in browser, global in server
root = this;

# Saving the previous value of Phallanxpress if noConflict is used
previousPhallanxpress = root.Phallanxpress


# Creation of the top level namespace.
if typeof exports isnt 'undefined'
  Phallanxpress = exports.Phallanxpress = {}
else 
  Phallanxpress = root.Phallanxpress = {}

Phallanxpress.VERSION = '0.1.0'

# If underscore is not present then require it if we are on server
_ = root._
_ = require('underscore') if not _ and typeof require isnt 'undefined'

# If Backbone is not present then require it if we are on server
Backbone = root.Backbone;
Backbone = require('backbone') if not Backbone and typeof require isnt 'undefined'


# DOM library (same as Backbone)
$ = root.jQuery || root.Zepto || root.ender

Phallanxpress.noConflict = ->
  root.Phallanxpress = previousPhallanxpress
  this
  

