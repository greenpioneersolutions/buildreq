'use strict';
var express = require('express'),
    buildReq = require('../buildreq');
buildReq.config({
    query: {
        schema: ['created', 'name', 'data', 'title']
    }
})
var app = express();
app.use(buildReq.query);
app.get('/', function (req, res) {
    res.json(req.queryParameters);
})
app.listen(3000, function () {
    console.log("Express server listening on port 3000");
});