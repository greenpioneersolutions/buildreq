;(function () {
  'use strict'
  var mongoose = require('mongoose')
  var _ = require('lodash')
  var fs = require('fs')
  var path = require('path')
  var chalk = require('chalk')
  var files = ['options.js', 'query.js', 'response.js', 'routing.js', 'error.js']

  fs.readdir(path.resolve(__dirname, './lib/'), function (err, checkFiles) {
    if (!err) {
      files = checkFiles
    // console.log(chalk.green('BUILDREQ- Files loaded: '+files))
    } else {
      console.log(chalk.red(err))
      console.log(chalk.red('BUILDREQ- Reverting to default config: ' + files))
    }
  })
  var functions = {}
  _.forEach(files, function (n) {
    functions[path.basename(n, '.js')] = require('./lib/' + n)
  })

  function Build (options) {
    if (options) {
      this.options = _.merge(functions.options, options)
      if (this.options.console)console.log(chalk.green('Custom:Configs Added On Build'))
    } else {
      this.options = functions.options
      if (this.options.console)console.log(chalk.blue('Default:Configs Added On Build'))
    }
  }
  Build.prototype.queryMiddleware = function (params) {
    try {
      var mongoose = params.mongoose || require('bluebird').promisifyAll(require('mongoose'))
    } catch (err) {
      mongoose = require('bluebird').promisifyAll(require('mongoose'))
    } finally {
      mongoose.Promise = require('bluebird')
    }
    var defaults = this.options.query
    var schema = []
    var schemaSort = []
    var models
    if (defaults.mongoose) {
      models = _.keys(mongoose.models)
      _.forEach(models, function (n, key) {
        _.forEach(mongoose.models[n].schema.tree, function (j, key) {
          schema.push(key)
        })
      })
    } else {
      if (this.options.console)console.log(chalk.blue('Custom:Schema used'))
      schema = defaults.schema
    }
    schema = _.uniq(schema)
    _.forEach(schema, function (key) {
      schemaSort.push(key)
      schemaSort.push('-' + key)
    })
    function setup () {
      return {
        mongoose: mongoose,
        options: this.options,
        defaults: defaults,
        schema: schema,
        schemaSort: schemaSort,
        models: models,
        modelNameCheck: function (name) {
          return models[models.indexOf(name)]
        }
      }
    }
    return functions.query.queryMiddleware(setup.bind(this))
  }
  Build.prototype.query = function (params) {
    try {
      var mongoose = params.mongoose || require('bluebird').promisifyAll(require('mongoose'))
    } catch (err) {
      mongoose = require('bluebird').promisifyAll(require('mongoose'))
    } finally {
      mongoose.Promise = require('bluebird')
    }
    var defaults = this.options.query
    var schema = []
    var schemaSort = []
    var models

    if (defaults.mongoose) {
      models = _.keys(mongoose.models)
      _.forEach(models, function (n, key) {
        _.forEach(mongoose.models[n].schema.tree, function (j, key) {
          schema.push(key)
        })
      })
    } else {
      if (this.options.console)console.log(chalk.blue('Custom:Schema used'))
      schema = defaults.schema
    }
    schema = _.uniq(schema)
    _.forEach(schema, function (key) {
      schemaSort.push(key)
      schemaSort.push('-' + key)
    })

    function setup () {
      return {
        mongoose: mongoose,
        options: this.options,
        req: params.req || {'query': {}},
        defaults: defaults,
        schema: schema,
        schemaSort: schemaSort,
        models: models,
        modelNameCheck: function (name) {
          return models[models.indexOf(name)]
        }
      }
    }
    return functions.query.query(setup.bind(this))
  }
  Build.prototype.error = function () {
    function setup () {
      return {
        options: this.options
      }
    }
    return functions.error(setup.bind(this))
  }
  Build.prototype.response = function (res, value) {
    function setup () {
      return {
        options: this.options,
        value: value,
        res: res
      }
    }
    return functions.response.response(setup.bind(this))
  }
  Build.prototype.responseMiddleware = function () {
    function setup () {
      return {
        options: this.options
      }
    }
    return functions.response.responseMiddleware(setup.bind(this))
  }
  Build.prototype.routing = function (params, callback) {
    function setup () {
      var consoleReady = this.options.console
      try {
        var mongoose = params.mongoose || require('bluebird').promisifyAll(require('mongoose'))
      } catch (err) {
        mongoose = require('bluebird').promisifyAll(require('mongoose'))
      } finally {
        mongoose.Promise = require('bluebird')
      }

      try {
        var middlewareRouting = _.merge({
          auth: [],
          noauth: [],
          all: [],
          admin: []
        }, params.middleware)
      } catch (err) {
        middlewareRouting = {
          auth: [],
          noauth: [],
          all: [],
          admin: []
        }
      }

      try {
        var remove = params.remove || []
      } catch (err) {
        remove = []
      }
      try {
        var app = params.app || false
      } catch (err) {
        app = false
      }
      var models = _.remove(_.keys(mongoose.models), function (n) {
        var found = true
        _.forEach(remove, function (r) {
          if (n === _.capitalize(r)) {
            if (consoleReady)console.log(chalk.green('Routing - Remove Model:' + r))
            found = false
          }
        })
        return found
      })
      return {
        options: this.options,
        app: app,
        mongoose: mongoose,
        middleware: middlewareRouting,
        response: this.response,
        error: this.error,
        callback: callback,
        models: models
      }
    }
    return functions.routing(setup.bind(this))
  }
  Build.prototype.config = function (data) {
    if (data) {
      this.options = _.merge(this.options, data)
      if (this.options.console)console.log(chalk.green('Custom:Configs Added On Config'))
    } else {
      console.log(chalk.red('No Configs Added On Config'))
    }
  }
  Build.prototype.mongooseCheck = function (name) {
    return mongoose.connection.readyState === 0 ? 0 : 1
  }
  function build (options) {
    if (options === undefined) {
      return new Build()
    }

    if (typeof options === 'object' && options !== null) {
      return new Build(options)
    }
    throw new TypeError(chalk.red('Expected object for argument options but got ' + chalk.red.underline.bold(options)))
  }
  module.exports = build
})()
