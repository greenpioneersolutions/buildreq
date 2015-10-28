'use strict';
var mongoose = require('mongoose'),
    express = require('express'),
    _ = require('lodash'),
    buildReq = require('../buildreq');
buildReq.config({
    response:{
        method:"get",
        data:{},
        user:{},
        count:0,
        hostname:"",
        type:""
    },
    query:{
        sort: "-created",
        limit: 30,
        select: "",
        filter:{},
        populateId: "",
        populateItems: "",
        lean: false,
        skip: 0,
        where: "",
        gt: 1,
        lt: 0,
        in : [],
        errorMessage: "Unknown Value"
    }
})
mongoose.connect('mongodb://localhost/mean-dev');
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
    Blog.find()
        .exec()
        .then(function(blogs) {
            //NEED TO ADD HANDLING FOR ERRORS
            buildReq.response(res,{method:'json',query:req.queryParameters,hostname:req.get('host')+req.path,route:req.route,data:blogs});
        });
});

app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});