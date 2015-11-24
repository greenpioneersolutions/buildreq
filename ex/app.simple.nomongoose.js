'use strict'
var express = require('express')
var build = require('../index.js')({console: false})
build.config({
  query: {
    schema: ['created', 'name', 'data', 'title']
  }
})
var app = express()
app.use(build.query)
app.get('/', function (req, res) {
  res.json(req.queryParameters)
})
app.listen(3000, function () {
  console.log('Express server listening on port 3000')
})
