'use strict'
var mongoose = require('mongoose')
var express = require('express')
var build = require('../index.js')({console: true})
build.config({
  response: {
    method: 'get',
    data: {},
    user: {},
    count: 0,
    hostname: '',
    type: '',
    // actions: {
    //   prev: false,
    //   next: false
    // },
    delete: ['error', 'user']
  },
  query: {
    sort: '',
    limit: 20,
    select: '',
    filter: {},
    populateId: 'user',
    populateItems: '',
    deepPopulate: 'user.projects',
    // add example of deepPop Later
    lean: false,
    skip: 0,
    errorMessage: 'Unknown Value'
  },
  routing: {
    schema: true,
    url: '/api/v1/'
  }
})
mongoose.connect('mongodb://localhost/build', {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
})
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function callback () {
  // console.log("connection")
})
var usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'testname'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    default: 'testemail'
  },
  roles: {
    type: Array
  },
  username: {
    type: String,
    required: true,
    trim: true,
    default: 'testusername'
  }
})
var blogSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'testtitle'
  },
  content: {
    type: String,
    required: true,
    trim: true,
    default: 'testcontent'
  },
  author: {
    type: String,
    required: true,
    trim: true,
    default: 'testauthor'
  },
  name: {
    type: Boolean,
    default: true
  },
  authors: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Users'
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users'
  }
})

var Users = mongoose.model('Users', usersSchema)
var Blog = mongoose.model('Blog', blogSchema)

var app = express()

// order matters
app.use(build.queryMiddleware({mongoose: mongoose}))
var testTime = function (req, res, next) {
  next()
}
var testParameters = function (req, res, next) {
  next()
}
var testboth = function (req, res, next) {
  next()
}
// builds a complete api based of shcemas
// http://localhost:3000/api/v1/blog - GET , CREATE  - http://localhost:3000/api/v1/blog/:blogId - PUT DELETE GET
// http://localhost:3000/api/v1/users - GET , CREATE  - http://localhost:3000/api/v1/users/:blogId - PUT DELETE GET
var middle = {
  auth: [testParameters],
  noauth: [testTime],
  all: [testboth]
}
//
// var routeResponse = build.routing({
//   app: app,
//   middleware: middle
// })
// console.log(routeResponse)
build.routing({
  app: app,
  middleware: middle,
  remove: [] // remove users
}, function (error, data) {
  if (error) console.log(error)
// console.log(data)
})
app.set('port', process.env.PORT || 3000)
// View
app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: __dirname
  })
})
app.get('/response', function (req, res) {
  build.response(res, {
    method: 'json',
    query: req.queryParameters,
    hostname: req.get('host') + req.path,
    route: req.route,
    data: 'no data'
  })
})
app.get('/blog/test/', function (req, res) {
  Blog.find(req.queryParameters.filter)
    .where(req.queryParameters.where)
    .sort(req.queryParameters.sort)
    .select(req.queryParameters.select)
    .limit(req.queryParameters.limit)
    .skip(req.queryParameters.skip)
    .exec(function (err, blogs) {
      if (err) {
        return res.status(500).json({
          error: 'Cannot get the data'
        })
      }
      Blog.count(req.queryParameters.filter, function (err, totalCount) {
        if (err) {
          return res.status(500).json({
            error: 'Cannot get the data'
          })
        }
        build.response(res, {
          count: totalCount,
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: blogs
        })
      })
    })
})
app.get('/blog', function (req, res) {
  Blog.find(req.queryParameters.filter || '')
    .where(req.queryParameters.where || '')
    .sort(req.queryParameters.sort || '')
    .select(req.queryParameters.select || '')
    .limit(req.queryParameters.limit || '')
    .skip(req.queryParameters.skip || '')
    .deepPopulate(req.queryParameters.deepPopulate || '')
    .populate(req.queryParameters.populateId || '', req.queryParameters.populateItems || '')
    .exec(function (err, blogs) {
      if (err) {
        return res.status(500).json({
          error: 'Cannot get the data'
        })
      }
      Blog.count(req.queryParameters.filter, function (err, totalCount) {
        if (err) {
          return res.status(500).json({
            error: 'Cannot get the data'
          })
        }
        build.response(res, {
          count: totalCount,
          method: 'json',
          query: req.queryParameters,
          hostname: req.get('host') + req.path,
          route: req.route,
          data: blogs
        })
      })
    })
})
app.get('/create', function (req, res) {
  var blog = new Blog({})
  var user = new Users({})
  blog.save(function (err) {
    if (err) {
      return res.status(400)
    } else {
      user.save(function (err) {
        if (err) return res.status(400)
        else res.status(201)
      })
    }
  })
})
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
module.exports = app
