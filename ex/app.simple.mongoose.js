'use strict'
var express = require('express')
var mongoose = require('mongoose')
var build = require('../buildreq')()
var app = express()
mongoose.connect('mongodb://localhost/mean-dev')
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
  }
})
var Blog = mongoose.model('Blog', blogSchema)
console.log(Blog)
app.use(build.query)
app.get('/', function (req, res) {
  res.json(req.queryParameters)
})
app.listen(3000, function () {
  console.log('Express server listening on port 3000')
})
