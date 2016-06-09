# BuildREQ

[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![dependencies](https://david-dm.org/greenpioneersolutions/buildreq.svg)](https://david-dm.org/greenpioneersolutions/buildreq)
[![npm-issues](https://img.shields.io/github/issues/greenpioneersolutions/buildreq.svg)](https://github.com/greenpioneersolutions/buildreq/issues)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/greenpioneersolutions/buildreq.svg?branch=master)](https://travis-ci.org/greenpioneersolutions/buildreq)
[![js-standard-style](https://nodei.co/npm/buildreq.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/buildreq.png?downloads=true&downloadRank=true&stars=true)

[npm-image]: https://img.shields.io/npm/v/buildreq.svg?style=flat
[npm-url]: https://npmjs.org/package/buildreq
[downloads-image]: https://img.shields.io/npm/dm/buildreq.svg?style=flat
[downloads-url]: https://npmjs.org/package/buildreq

## What is Build Response,Routing,Error & Query?
It is currently a Mongoose & Express dependent module. It can be used in a different ways. It is most useful when used as a middleware with expressjs  in conjunction with your api.


## Build.queryMiddleware
``` javascript
console.log(build.query({mongoose:mongoose,req:req})
```

## Build.query
``` javascript
app.use(build.queryqueryMiddleware())
//or send mongoose in if your having loading issues
app.use(build.queryMiddleware({mongoose:mongoose}))
``` 

Configs
``` javascript
build.config({
  query: {
  //configs go here
  }
})
```

## Build.error
``` javascript
app.use(build.error())
``` 
## Build.response
``` javascript
build.response(res, {
    method: 'json',
    query: req.queryParameters,
    hostname: req.get('host') + req.path,
    route: req.route,
    data: 'no data'
})
```
## Build.responseMiddleware
``` javascript
app.use(build.responseMiddleware())
res.response(res, {
    count: results.count,
    method: 'json',
    query: req.queryParameters,
    hostname: req.get('host') + req.baseUrl,
    route: req.route,
    data: results.get,
    type: Campaign
})
```
## Build.routing
``` javascript
var blogSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  }
})
Blog = mongoose.model('Blog', blogSchema)
//var route = build.routing(app)
//console.log(route)
//or
build.routing({
    app:app,
    mongoose: mongoose
},function(error,data){
    console.log(data)
})

// Routes that will be created for you
// http://localhost:3000/api/v1/blog - GET,POST | GETALL - CREATE 
// http://localhost:3000/api/v1/blog/id/:blogId - PUT,DELETE,GET | UPDATE DELETE VIEWONE
// http://localhost:3000/api/v1/blog/aggregate - GET | USE AGGREGATION FRAMEWORK
// http://localhost:3000/api/v1/blog/fields/ - GET | GETS ALL FIELDS IN SCHEMA
// http://localhost:3000/api/v1/blog/options/ - GET | GETS ALL OPTIONS IN SCHEMA
// http://localhost:3000/api/v1/blog/_indexes/ - GET | GETS ALL INDEXES IN SCHEMA

//You Can Inject mongoose in your routing if need be
//You can also wait for the connection to openbefore injecting it
var mongoose = require('mongoose')

  mongoose.connection.onOpen(function(){
    //console.log(mongoose.connection)
    console.log('open')
    //console.log(mongoose.models)
    build.routing(app,mongoose)
  })


// OR you can  build it on your end by setting the config to not build
var build = require('buildreq')(
    routing: {
        schema: true,
        url: '/api/v1/',
        build: false
    }
)

_.forEach(build.routing(app, mongoose), function (m) {
  app.use(m.route, m.app)
})
``` 

Configs
``` javascript
build.config({
  routing: {
  //configs go here
  }
})
```
## Build.config
``` javascript
var build = require('../buildreq')
build.config({configs: 'here'}-->)
```


## R - Response Builder

The next common way to use this module is to have it build your api response so that you have a consistent format. This response is dynamic enough right off the bat to do logic based on actions you wish to give your frontend. Great thing is if you don’t like some of the fields you can delete them in the configs. 

Key | Description | Default Value
--- | --- | ---
`method` | uses the GET method by default | `get`
`data` | uses empty object by default | `{}`
`user` | uses empty object by default | `{}`
`count` | uses zero by default | `0`
`hostname` | uses empty string by default | `''`
`query` | uses empty object by default | `{}`
`type` | uses empty string by default | `''`
`actions.prev` | turns on action.prev by default | `true`
`actions.next` | turns on action.next by default | `true`
`actions.reload` | turns on action.reload by default | ` true`
`middleware`| allows you to place middle ware on the routes | `auth: [],noauth: [],all: [],admin:[]`
`delete` | deletes response objects | `[] `

## R - Routing Builder

It is a optional routing builder . what it does is it creates CRUD routes and interacts with the database based off of the shcema from mongoose. More to come on it later.

Key | Description | Default Value
--- | --- | ---
`schema` | uses mongoose schema by default - N/A taken out for now | []
`url` | change the default url that the routing is built with | '/api/v1/'
`build` | change the default to false to manually mount the routing | 'true'
`middleware` | change the default to false to manually mount the routing | `{ auth: [], noauth: [], all: [] }`
`remove` | remove mongoose models by name if you dont want them routed ex `['Users'] | `[]`
`deepPopulateOptions` |  [Mongoose populate options](http://mongoosejs.com/docs/api.html#model_Model.populate) |`{whitelist: [],populate: {},rewrite: {}}`
`deepPopulateOptions.whitelist` | [Mongoose populate options](http://mongoosejs.com/docs/api.html#model_Model.populate)  |`[]`
`deepPopulateOptions.populate` | [Mongoose populate options](http://mongoosejs.com/docs/api.html#model_Model.populate)  |`{}`
`deepPopulateOptions.rewrite` |  [Mongoose populate options](http://mongoosejs.com/docs/api.html#model_Model.populate) |`{}`


## E - Error
The error is still being worked on to make better but currently it is a base level error handler


## Q - Query Builder 

The most common used way is as a dynamic query builder as express middleware. It watches on the “req.query “ to see how you users interacting with it. Once it captures the data it will then check it again all of you defined mongoose schemas. By doing that it allows the builder to know what to allow and what not to all. This will give you a dynamic api query handler with out having to code anything at all . All you need to do is to tell express to use the module as middleware “app.use(buildReq.query);”

Key | Description | Default Value
--- | --- | ---
`strict` | uses strict to make it follow strict to mongoose | `false`
`sort` | uses created field by default | `'-created'`
`filter` | uses empty object by default otherwise it finds dynamically based of schema | `{}`
`limit` | uses empty string by default | `20`
`select` | uses empty string by default | `''`
`populateId` | uses empty string by default | `''`
`populateItems` | uses empty string by default | `''`
`limitToPopulateId` | uses empty string by default | `''`
`limitToPopulateItems` | uses empty string by default | `''`
`deepPopulate` | uses empty string by default | `''`
`lean` | uses empty string by default | `''`
`skip` | uses empty string by default | `0`
`where` | uses empty string by default | `''`
`gt:` | uses where for GreaterThan | `false`
`gte:` | uses where for GreaterThanEqual | `false`
`lte:` | uses where for LessThanEqual | `false`
`lt:` | uses where for LessThan | `false`
`in:` | uses where for IN array | `false`
`ne:` | uses where for NE Not Equal | `false`
`nin:` | uses where for NIN not in array | `false`
`regex:` | uses where with options for regex | `false`
`options:` | uses where regex required | `false`
`size:` | uses where for SIZE of array | `false`
`all:` | uses where for ALL | `false`
`find:` | uses where for FIND | `false`
`equals:` | uses where for EQUALS | `false`
`aggregate:`| uses Aggregation Framework with object you send| `false`
`errorMessage` | uses string by default when user passes bad value | `Unknown Value`
`delete` | uses empty array by default | `[]`
`mongoose` | uses boolean to use mongoose to to have custom | `true`
`schema` | uses empty [] if you dont use a custom schema | `[]`


Key | Example urls
--- | ---
gt & lt | `http://localhost:3000/api/v1/campaigns?where=created&gt=2015-11-17&lt=2015-12-30`
equals | `http://localhost:3000/api/v1/campaigns?where=email&equals=john@greenpioneersolutions.com`
in | `http://localhost:3000/api/v1/campaigns?where=emails&in=javier@greenpioneersolutions.com`
ne | `http://localhost:3000/api/v1/campaigns?where=email&ne=john@greenpioneersolutions.com`
nin | `http://localhost:3000/api/v1/campaigns?where=emails&nin=javier@greenpioneersolutions.com`
regex & options| `http://localhost:3000/api/v1/campaigns?where=email&regex=\/com\/&options=%3Coptions%3E`
size | `http://localhost:3000/api/v1/campaigns?where=emails&size=2`
all | `http://localhost:3000/api/v1/campaigns?where=email&all=shawn@greenpioneersolutions.com`
find | `http://localhost:3000/api/v1/campaigns?where=email&find=shawn@`
aggregate | `http://localhost:3000/api/v1/campaigns/task/aggregated?aggregate[$unwind]=$donations&aggregate[$group][_id]=$_id&aggregate[$group][balance][$sum]=$donations.amount`
  




### Future
 -more docs
 -debug

### Contributing
Looking for anyone that could have a use for this module in his or her daily life to help contribute .

### Examples

Take a look at my [examples](https://github.com/greenpioneersolutions/buildreq/tree/master/ex)

``` bash
cd /YOURDIRECTORY/
npm install buildreq
cd ex/
node app.js
``` 

Created by ![Green Pioneer](http://greenpioneersolutions.com/img/icons/apple-icon-180x180.png)

#### This is [on GitHub](https://github.com/greenpioneersolutions/buildreq)
#### Find us [on GitHub](https://github.com/greenpioneersolutions)
#### Find us [on Twitter](https://twitter.com/greenpioneerdev)
#### Find us [on Facebook](https://www.facebook.com/Green-Pioneer-Solutions-1023752974341910)
#### Find us [on The Web](http://greenpioneersolutions.com/)