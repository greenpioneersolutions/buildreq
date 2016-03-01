var _ = require('lodash')
var express = require('express')
var chalk = require('chalk')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var helmet = require('helmet')
var compression = require('compression')
var async = require('async')
var fs = require('fs')
var path = require('path')
var multer = require('multer')
var xlsx = require('node-xlsx')

function routing (setup) {
  var settings = setup()
  var apps = {}
  var mountRoutes = {}

  if (settings.options.routing.socket) {
    var app = require('express')()
    var server = require('http').createServer(app)
    var io = require('socket.io')(server)
    io.on('connection', function (socket) {
      // console.log("Joined: ", socket.handshake.query)
      _.forEach(settings.options.routing.sockets, function (n, k) {
        socket.on(n, function (data) {
          io.emit(n, data)
        })
      })
      socket.on('disconnect', function (data) {
        io.emit('disconnect', data)
      })
    })
    server.listen(8282)
  }

  _.forEach(settings.models, function (n) {
    apps[n] = express() // the sub app
    // body parsing middleware.
    apps[n].use(bodyParser.json())
    // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
    apps[n].use(methodOverride())
    // well-known web vulnerabilities
    apps[n].use(helmet())
    // Gzip compressing
    apps[n].use(compression())
    // ERROR middleware - still need to develop
    apps[n].use(settings.error())
    // GET all
    // NEED TO UPDATE THE POPULATE
    if (settings.middleware.noauth)apps[n].get('/', settings.middleware.noauth)
    if (settings.middleware.all)apps[n].get('/', settings.middleware.all)
    apps[n].get('/', function (req, res, next) {
      async.parallel({
        get: function (callback) {
          settings.mongoose.model([n])
            .find(req.queryParameters.filter || '')
            .where(req.queryParameters.where || '')
            .sort(req.queryParameters.sort || '')
            .select(req.queryParameters.select || '')
            .limit(req.queryParameters.limit || '')
            .skip(req.queryParameters.skip || '')
            .populate(req.queryParameters.populateId || '', req.queryParameters.populateItems || '')
            .exec()
            .then(function (thenData) {
              callback(null, thenData)
            }).catch(
            function (err) {
              callback(err, 0)
            })
        },
        count: function (callback) {
          settings.mongoose.model([n])
            .find(req.queryParameters.filter || '')
            .where(req.queryParameters.where || '')
            .count()
            .then(function (count) {
              callback(null, count)
            }).catch(
            function (err) {
              callback(err, 0)
            })
        }
      }, function (err, results) {
        if (err) {
          return res.status(500).json({
            error: err.message
          })
        } else {
          settings.response(res, {
            count: results.count,
            method: 'json',
            query: req.queryParameters,
            hostname: req.get('host') + req.baseUrl,
            route: req.route,
            data: results.get,
            type: n
          })
        }
      })
    })
    // CREATE new
    if (settings.middleware.auth)apps[n].post('/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].post('/', settings.middleware.all)
    apps[n].post('/', function (req, res, next) {
      var data = settings.mongoose.model([n])
      data
        .create(req.body)
        .then(function (thenData) {
          settings.response(res, {
            method: 'json',
            query: req.queryParameters,
            hostname: req.get('host') + req.path,
            route: req.route,
            data: thenData,
            type: n
          })
        })
        .catch(function (err) {
          return next(err)
        })
    })

    // UPDATE by ID
    if (settings.middleware.auth)apps[n].put('/:' + n + 'Id', settings.middleware.auth)
    if (settings.middleware.all)apps[n].put('/:' + n + 'Id', settings.middleware.all)
    apps[n].put('/:' + n + 'Id', function (req, res, next) {
      var data = req[apps[n]]
      data = _.merge(data, req.body)
      data.save().then(function (thenData) {
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: thenData,
          type: n
        })
      }).catch(function (err) {
        return next(err)
      })
    })

    // PATCH by ID patch
    if (settings.middleware.auth)apps[n].patch('/:' + n + 'Id', settings.middleware.auth)
    if (settings.middleware.all)apps[n].patch('/:' + n + 'Id', settings.middleware.all)
    apps[n].patch('/:' + n + 'Id', function (req, res, next) {
      var data = req[apps[n]]
      data = _.merge(data, req.body)
      data.save().then(function (thenData) {
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: thenData,
          type: n
        })
      }).catch(function (err) {
        return next(err)
      })
    })

    // DELETE by ID
    if (settings.middleware.auth)apps[n].delete('/:' + n + 'Id', settings.middleware.auth)
    if (settings.middleware.all)apps[n].delete('/:' + n + 'Id', settings.middleware.all)
    apps[n].delete('/:' + n + 'Id', function (req, res, next) {
      var data = req[apps[n]]
      data.remove().then(function (thenData) {
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: thenData,
          type: n
        })
      }).catch(function (err) {
        return next(err)
      })
    })

    // SHOW by ID
    if (settings.middleware.noauth)apps[n].get('/:' + n + 'Id', settings.middleware.noauth)
    if (settings.middleware.all)apps[n].get('/:' + n + 'Id', settings.middleware.all)
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
      if (!settings.mongoose.Types.ObjectId.isValid(id)) {
        return res.status(500).send('Parameter passed is not a valid Mongo ObjectId')
      } else {
        try {
          settings.mongoose.model([n])
            .findOne({
              _id: id
            })
            .populate(req.queryParameters.populateId || '', req.queryParameters.populateItems || '')
            .exec()
            .then(function (thenData) {
              if (!thenData) return next(new Error('Failed to load data ' + id))
              req[apps[n]] = thenData
              next()
            })
            .catch(function (err) {
              if (err) return next(err)
            })
        } catch (err) {
          console.log(err)
          req[apps[n]] = {}
          next()
        }
      }
    })
    // use aggregation framework
    if (settings.middleware.auth)apps[n].get('/task/aggregate/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/aggregate/', settings.middleware.all)
    apps[n].get('/task/aggregate/', function (req, res, next) {
      if (req.queryParameters.aggregate) {
        settings.mongoose.model([n]).aggregate(req.queryParameters.aggregate || '').then(function (results) {
          settings.response(res, {
            count: results.length,
            method: 'json',
            query: req.queryParameters,
            hostname: req.get('host') + req.path,
            route: req.route,
            data: results,
            type: n
          })
        }).catch(function (err) {
          console.log('err was here', err)
          return next(err)
        })
      } else {
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: {error: 'no data object for aggregate'},
          type: n
        })
      }
    })
    // show count
    if (settings.middleware.auth)apps[n].get('/task/count/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/count/', settings.middleware.all)
    apps[n].get('/task/count/', function (req, res, next) {
      settings.mongoose.model([n]).count(req.queryParameters.filter || '').then(function (totalCount) {
        settings.response(res, {
          count: totalCount,
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: {count: totalCount},
          type: n
        })
      }).catch(function (err) {
        return next(err)
      })
    })

    // show fields
    if (settings.middleware.auth)apps[n].get('/task/fields/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/fields/', settings.middleware.all)
    apps[n].get('/task/fields/', function (req, res) {
      var fields = _.remove(_.keys(settings.mongoose.model([n]).schema.tree), function (f) {
        if (f === '_id') return false
        else if (f === 'id') return false
        else if (f === '__v') return false
        else return true
      })
      var treePath = settings.mongoose.model([n]).schema.paths
      var tree = {}
      _.forEach(treePath, function (t, k) {
        if (k !== 'id' && k !== '__v' && k !== '_id') {
          tree[k] = {
            instance: t.instance,
            isRequired: t.isRequired || false
          }
        }
      })
      settings.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: {
          fields: fields,
          tree: tree
        },
        type: n
      })
    })
    // options
    if (settings.middleware.auth)apps[n].get('/task/options/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/options/', settings.middleware.all)
    apps[n].get('/task/options/', function (req, res) {
      settings.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: _.keys(settings.mongoose.model([n]).schema.options),
        type: n
      })
    })
    // _indexes
    if (settings.middleware.auth)apps[n].get('/task/_indexes/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/_indexes/', settings.middleware.all)
    apps[n].get('/task/_indexes/', function (req, res) {
      settings.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: _.keys(settings.mongoose.model([n]).schema._indexes),
        type: n
      })
    })

    // Multer
    if (settings.options.console && settings.options.routing.build && settings.app)console.log(chalk.blue('BuildREQ Upload Temp:', settings.options.routing.multer.temp))
    if (settings.options.console && settings.options.routing.build && settings.app)console.log(chalk.blue('BuildREQ Upload Destination:', settings.options.routing.multer.destination))

    if (!fs.existsSync(settings.options.routing.multer.temp)) {
      fs.mkdirSync(settings.options.routing.multer.temp)
    }
    if (!fs.existsSync(settings.options.routing.multer.destination)) {
      fs.mkdirSync(settings.options.routing.multer.destination)
    }
    if (!fs.existsSync(settings.options.routing.multer.temp + '/' + n.toLowerCase())) {
      fs.mkdirSync(settings.options.routing.multer.temp + '/' + n.toLowerCase())
    }
    if (!fs.existsSync(settings.options.routing.multer.destination + '/' + n.toLowerCase())) {
      fs.mkdirSync(settings.options.routing.multer.destination + '/' + n.toLowerCase())
    }
    var upload = multer({ dest: settings.options.routing.multer.temp + '/' + n.toLowerCase() })
    var destination = path.resolve(__dirname, settings.options.routing.multer.destination + '/' + n.toLowerCase())
    if (settings.middleware.auth)apps[n].post('/task/upload/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].post('/task/upload/', settings.middleware.all)
    apps[n].post('/task/upload/', upload.single('file'), function (req, res, next) {
      fs.readFile(req.file.path, function (err, data) {
        if (err)next(err)
        fs.writeFile(destination + '/' + req.file.originalname, data, function (err) {
          if (err) {
            return next(err)
          } else {
            try {
              fs.unlinkSync(req.file.path)
            } catch (err) {
              console.log(err, 'err')
            }
            settings.response(res, {
              method: 'json',
              query: req.queryParameters,
              hostname: req.get('host') + req.path,
              route: req.route,
              data: path.resolve(__dirname, settings.options.routing.multer.destination, '/' + n.toLowerCase() + '/', req.file.originalname),
              type: n
            })
          }
        })
      })
    })

    if (settings.middleware.auth)apps[n].post('/task/uploads/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].post('/task/uploads/', settings.middleware.all)
    apps[n].post('/task/uploads/', upload.any(), function (req, res, next) {
      var filesSaved = []
      _.forEach(req.files, function (f, fkey) {
        fs.readFile(f.path, function (err, data) {
          if (err) {
            next(err)
          }
          fs.writeFile(destination + '/' + f.originalname, data, function (err) {
            if (err) {
              return next(err)
            } else {
              try {
                fs.unlinkSync(f.path)
              } catch (err) {
                console.log(err, 'err')
              }
              filesSaved.push(path.resolve(__dirname, settings.options.routing.multer.destination, '/' + n.toLowerCase() + '/', f.originalname))
            }
          })
        })
      })
      settings.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: filesSaved,
        type: n
      })
    })

    if (settings.middleware.auth)apps[n].get('/task/parse/excel/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/parse/excel/', settings.middleware.all)
    apps[n].get('/task/parse/excel/:filename', function (req, res) {
      if (!fs.accessSync(path.resolve(settings.options.routing.multer.destination + '/' + n.toLowerCase() + '/' + req.params.filename))) {
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: {file: 'No File Found'},
          type: n
        })
      } else {
        var obj = xlsx.parse(path.resolve(settings.options.routing.multer.destination + '/' + n.toLowerCase() + '/' + req.params.filename))
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: obj,
          type: n
        })
      }
    })

    // STAT
    if (settings.middleware.auth)apps[n].get('/task/stat/:file', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/stat/:file', settings.middleware.all)
    apps[n].get('/task/stat/:file', function (req, res, next) {
      fs.stat(path.resolve(settings.options.routing.multer.destination + '/' + n.toLowerCase() + '/' + req.params.file), function (err, stat) {
        if (err) {
          return next(err)
        } else {
          settings.response(res, {
            method: 'json',
            query: req.queryParameters,
            hostname: req.get('host') + req.path,
            route: req.route,
            data: stat,
            type: n
          })
        }
      })
    })

    // DIR
    if (settings.middleware.auth)apps[n].get('/task/dir/', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/dir/', settings.middleware.all)
    apps[n].get('/task/dir/', function (req, res, next) {
      var readDir = path.resolve(settings.options.routing.multer.destination + '/' + n.toLowerCase() + '/')
      if (!fs.existsSync(readDir)) {
        fs.mkdirSync(readDir)
      }
      fs.readdir(readDir, function (err, files) {
        if (err) {
          return next(err)
        } else {
          settings.response(res, {
            method: 'json',
            query: req.queryParameters,
            hostname: req.get('host') + req.path,
            route: req.route,
            data: files,
            type: n
          })
        }
      })
    })
    // FILE
    if (settings.middleware.auth)apps[n].get('/task/file/:file', settings.middleware.auth)
    if (settings.middleware.all)apps[n].get('/task/file/:file', settings.middleware.all)
    apps[n].get('/task/file/:file', function (req, res, next) {
      var readDir = path.resolve(settings.options.routing.multer.destination + '/' + n.toLowerCase() + '/' + req.params.file)
      if (!fs.existsSync(readDir)) {
        settings.response(res, {
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: {'message': 'does not exist'},
          status: 400,
          type: n
        })
      } else {
        fs.readFile(readDir, req.body.type || 'utf8', function (err, data) {
          if (err) {
            return next(err)
          } else {
            settings.response(res, {
              method: 'json',
              query: req.queryParameters,
              hostname: req.get('host') + req.path,
              route: req.route,
              data: data,
              type: n
            })
          }
        })
      }
    })

    // parse , excel pdf docx txt
    // create excel
    // turn on socket io
    // swagger

    // Mount the routes'/api/v1/{{n}}'
    if (settings.options.console && settings.options.routing.build && settings.app)console.log(chalk.blue('Routes Built: ' + settings.options.routing.url + n))
    if (settings.options.routing.build && settings.app)settings.app.use(settings.options.routing.url + n, apps[n])
    mountRoutes[n] = {}
    mountRoutes[n].app = apps[n]
    mountRoutes[n].route = settings.options.routing.url + n
  })
  if (typeof (settings.callback) === 'function') {
    return settings.callback(null, mountRoutes)
  } else {
    return {
      error: null,
      data: mountRoutes
    }
  }
}
module.exports = routing
