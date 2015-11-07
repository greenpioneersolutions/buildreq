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
      this.options = _.assign(functions.options, options)
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
  Build.prototype.routing = function (app) {
    function setup () {
      return {
        options: this.options,
        app: app,
        response: this.response,
        error: this.error
      }
    }
    return functions.routing(setup.bind(this))
  }
  Build.prototype.config = function (data) {
    if (data) {
      this.options = _.assign(this.options, data)
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
