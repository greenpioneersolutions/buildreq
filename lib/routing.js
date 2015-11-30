var _ = require('lodash')
var express = require('express')
var chalk = require('chalk')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

function routing (setup) {
  var settings = setup()
  var mongoose = settings.mongoose || require('mongoose')
  var subRoutes = _.keys(mongoose.models)
  var apps = {}
  var mountRoutes = {}

  _.forEach(subRoutes, function (n) {
    apps[n] = express() // the sub app

    apps[n].use(bodyParser.json())
    apps[n].use(methodOverride())
    // ERROR middleware - still need to develop
    apps[n].use(settings.error())
    // GET all
    apps[n].get('/', function (req, res) {
      mongoose.model([n])
        .find(req.queryParameters.filter)
        .sort(req.queryParameters.sort)
        .select(req.queryParameters.select)
        .limit(req.queryParameters.limit)
        .skip(req.queryParameters.skip)
        .exec(function (err, data) {
          if (err) {
            return res.status(500).json({
              error: err.message
            })
          }
          mongoose.model([n]).count(req.queryParameters.filter, function (err, totalCount) {
            if (err) {
              return res.status(500).json({
                error: err.message
              })
            }
            settings.response(res, {
              count: totalCount,
              method: 'json',
              query: req.queryParameters,
              hostname: req.get('host') + req.path,
              route: req.route,
              data: data,
              type: n
            })
          })
        })
    })
    // CREATE new
    apps[n].post('/', function (req, res) {
      var data = mongoose.model([n])(req.body)
      data.save(function (err) {
        if (err) {
          return res.status(500).json({
            error: err.message
          })
        }
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: data,
          type: n
        })
      })
    })

    // UPDATE by ID
    apps[n].put('/:' + n + 'Id', function (req, res) {
      var data = req[apps[n]]
      data = _.merge(data, req.body)
      data.save(function (err) {
        if (err) {
          return res.status(500).json({
            error: err.message
          })
        }
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: data,
          type: n
        })
      })
    })

    // DELETE by ID
    apps[n].delete('/:' + n + 'Id', function (req, res) {
      var data = req[apps[n]]
      data.remove(function (err) {
        if (err) {
          return res.status(500).json({
            error: 'Cannot delete the data'
          })
        }
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: data,
          type: n
        })
      })
    })

    // SHOW by ID
    apps[n].get('/:' + n + 'Id', function (req, res) {
      settings.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: req[apps[n]],
        type: n
      })
    })
    // PARAM of the ID
    apps[n].param(n + 'Id', function (req, res, next, id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(500).send('Parameter passed is not a valid Mongo ObjectId')
      } else {
        try {
          mongoose.model([n])
            .findOne({
              _id: id
            }, function (err, data) {
              if (err) return next(err)
              if (!data) return next(new Error('Failed to load data ' + id))
              req[apps[n]] = data
              next()
            })
        } catch (err) {
          console.log(err)
          req[apps[n]] = {}
          next()
        }
      }
    })

    // show fields
    apps[n].get('/task/fields/', function (req, res) {
      settings.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: _.keys(mongoose.model([n]).schema.tree),
        type: n
      })
    })

    // options
    apps[n].get('/task/options/', function (req, res) {
      settings.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: _.keys(mongoose.model([n]).schema.options),
        type: n
      })
    })
    // _indexes
    apps[n].get('/task/_indexes/', function (req, res) {
      settings.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: _.keys(mongoose.model([n]).schema._indexes),
        type: n
      })
    })
    // Mount the routes'/api/v1/'
    if (settings.options.console)console.log(chalk.blue('Routes Built: ' + settings.options.routing.url + n))
    if (settings.options.routing.build && settings.app)settings.app.use(settings.options.routing.url + n, apps[n])
    mountRoutes[n] = {}
    mountRoutes[n].app = apps[n]
    mountRoutes[n].route = settings.options.routing.url + n
  })
  return mountRoutes
}
module.exports = routing
