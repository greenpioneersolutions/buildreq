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
    lean: false,
    skip: 0,
    errorMessage: 'Unknown Value'
  },
  routing: {
    schema: true,
    url: '/api/v1/',
    uploads: true,
    multer: {
      temp: __dirname + '/temp',
      destination: __dirname + '/upload'
    },
    sockets: ['message'],
    socket: true
  }
})
//mongodb://test:test@ds037814.mlab.com:37814/jhumphre//mongoose.connect('mongodb://test:test@ds0378
mongoose.connect('mongodb://test:test@ds037814.mlab.com:37814/jhumphrey', {server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }}})
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
  remove: ['users']
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
    data: 'no data',
    status: 200
  })
})
app.get('/blog', function (req, res) {
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
