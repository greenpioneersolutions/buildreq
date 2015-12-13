;(function () {
  'use strict'
  var mongoose = require('mongoose')
  var _ = require('lodash')
  var fs = require('fs')
  var path = require('path')
  var chalk = require('chalk')
  var files = ['options.js', 'query.js', 'response.js', 'routing.js', 'error.js']
  // var env = process // env  argv  platform arch
  // console.log(env)

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
      this.options.query.mongoose = this.mongooseCheck()
      if (this.options.console)console.log(chalk.green('Custom:Configs Added On Build'))
    } else {
      this.options = functions.options
      this.options.query.mongoose = this.mongooseCheck()
      if (this.options.console)console.log(chalk.blue('Default:Configs Added On Build'))
    }
  }
  Build.prototype.query = function (options) {
    function setup () {
      return {
        options: this.options
      }
    }
    return functions.query(setup.bind(this))
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
    return functions.response(setup.bind(this))
  }
  Build.prototype.routing = function (params, callback) {
    function setup () {
      var consoleReady = this.options.console
      var mongoose = params.mongoose || require('mongoose')
      mongoose.Promise = require('bluebird')
      var middlewareRouting = {
        auth: [],
        noauth: [],
        all: []
      }
      middlewareRouting = _.merge(middlewareRouting, params.middleware)
      var remove = params.remove || []
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
        app: params.app,
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
      this.options.query.mongoose = this.mongooseCheck()
      if (this.options.console)console.log(chalk.green('Custom:Configs Added On Config'))
      return this.query(this.options)
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
