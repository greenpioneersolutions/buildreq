'use strict';
var mongoose = require('mongoose'),
    express = require('express'),
    _ = require('lodash'),
    buildReq = require('./buildreq');
buildReq.config({
    sort: "-created",
    limit: 30,
    select: "",
    populateId: "",
    populateItems: ""
})
mongoose.connect('mongodb://localhost/blog');

var blogSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    }
});
var usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    }
});

var Blog = mongoose.model('Blog', blogSchema),
    Users= mongoose.model('Users', usersSchema),
    app = express();

app.use(buildReq.query);

app.set('port', process.env.PORT || 3000);
// View
app.get('/', function(req, res) {
    res.json(req.queryParameters);
});

app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});