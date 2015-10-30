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

app.set('port', process.env.PORT || 3000);
// View
app.get('/', function (req, res) {
    res.json(req.queryParameters);
})
app.get('/response', function (req, res) {
    buildReq.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: "no data"
    });
})
app.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});