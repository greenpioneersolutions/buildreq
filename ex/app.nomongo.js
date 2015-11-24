'use strict'
var express = require('express')
var build = require('../index.js')({console: false})
// buildReq.config({
//     query: {
//         schema: ['created', 'name', 'data', 'title']
//     }
// })

var app = express()
app.use(build.query())
/*
build.config({
    query: {
            sort: "-created",
            filter: {},
            limit: 4420,
            select: "23",
            populateId: "23",
            populateItems: "32",
            lean: false,
            skip: 0,
            where: "",
            gt: 1,
            lt: 0,
            in : [],
            equals: "",
            errorMessage: " Value",
            delete: [],
            mongoose: true,
            schema: []
        }
})*/
app.set('port', process.env.PORT || 3000)
// View
app.get('/', function (req, res) {
  res.json(req.queryParameters)
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
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
