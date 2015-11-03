'use strict';
var mongoose = require('mongoose'),
    express = require('express'),
    _ = require('lodash'),
    buildReq = require('../buildreq');
buildReq.config({
    response: {
        method: "get",
        data: {},
        user: {},
        count: 0,
        hostname: "",
        type: "",
        actions: {
            prev: false,
            next: false
        },
        delete: ['error','user']
    },
    query: {
        sort: "",
        limit: 10,
        select: "",
        filter: {},
        populateId: "",
        populateItems: "",
        lean: false,
        skip: 0,
        where: "",
        gt: 1,
        lt: 0,
        in : [],
        equal: "",
        errorMessage: "Unknown Value"
    },
    routing:{
        schema:true
    }
})

mongoose.connect('mongodb://localhost/mean-dev');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connection");
});
var blogSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        trim: true,
        default: "testtitle"
    },
    content: {
        type: String,
        required: true,
        trim: true,
        default: "testcontent"
    },
    author: {
        type: String,
        required: true,
        trim: true,
        default: "testauthor"
    }
});
var usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: "testname"
    },
    email: {
        type: String,
        required: true,
        trim: true,
        default: "testemail"
    },
    username: {
        type: String,
        required: true,
        trim: true,
        default: "testusername"
    }
});

var Blog = mongoose.model('Blog', blogSchema),
    Users = mongoose.model('Users', usersSchema),
    app = express();

//order matters
app.use(buildReq.query);
//builds a complete api based of shcemas
// http://localhost:3000/api/v1/blog - GET , CREATE  - http://localhost:3000/api/v1/blog/:blogId - PUT DELETE GET
// http://localhost:3000/api/v1/users - GET , CREATE  - http://localhost:3000/api/v1/users/:blogId - PUT DELETE GET
buildReq.routing(app);
app.set('port', process.env.PORT || 3000);
// View
app.get('/', function (req, res) {
    buildReq.response(res, {
        method: 'json',
        query: req.queryParameters,
        hostname: req.get('host') + req.path,
        route: req.route,
        data: "no data"
    });
})
app.get('/blog', function (req, res) {
    Blog.find(req.queryParameters.filter)
        .sort(req.queryParameters.sort)
        .select(req.queryParameters.select)
        .limit(req.queryParameters.limit)
        .skip(req.queryParameters.skip)
        .exec(function (err, blogs) {
            Blog.count(req.queryParameters.filter, function (err, totalCount) {
                buildReq.response(res, {
                    count: totalCount,
                    method: 'json',
                    query: req.queryParameters,
                    hostname: req.get('host') + req.path,
                    route: req.route,
                    data: blogs
                });
            });

        });
});
app.get('/create', function (req, res) {
    var blog = new Blog({});
    var user = new Users({});
    blog.save(function (err) {
        if (err) return res.status(400);
        else user.save(function (err) {
            if (err) return res.status(400);
            else res.status(201);
        })
    })

});

app.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});