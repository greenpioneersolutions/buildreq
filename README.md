# BuildREQ

## R - Response - WORKING
## E - Error - N/A
## Q - Query - WORKING

Created by ![Green Pioneer](http://greenpioneersolutions.com/img/icons/apple-icon-180x180.png)

### What is Build Response,Error & Query?
It is currently a Mongoose & Express dependent module. It can be used in a different ways. It is most useful when used as a middleware with expressjs  in conjunction with your api.

###  Query Builder
The most common used way is as a dynamic query builder as express middleware. It watches on the “req.query “ to see how you users interacting with it. Once it captures the data it will then check it again all of you defined mongoose schemas. By doing that it allows the builder to know what to allow and what not to all. This will give you a dynamic api query handler with out having to code anything at all . All you need to do is to tell express to use the module as middleware “app.use(buildReq.query);” 
### Response Builder
The next common way to use this module is to have it build your api response so that you have a consistent format. This response is dynamic enough right off the bat to do logic based on actions you wish to give your frontend. Great thing is if you don’t like some of the fields you can delete them in the configs. 

###  Error Builder 
Currently underconstruction.

### Future
 -Add Error Builder
 -Add Refactor
 -Add Get Production Ready
 -gulp 
 -testing
 -more docs

### Contributing
Looking for anyone that could have a use for this module in his or her daily life to help contribute .

### RUN EXAMPLE CODE - 
``` bash
cd /YOURDIRECTORY/
npm install buildreq
cd ex/
node app.js
``` 

### Code To setup config & query builder as middleware
``` javascript
    buildReq = require('../buildreq');
    buildReq.config({
        response: {
            method: "get",
            data: {},
            user: {},
            count: 0,
            hostname: "",
            query: {},
            type: "",
            actions:{
                prev:true,
                next:true,
                reload:true
            },
            delete:[]
        },
        query: {
            sort: "-created",
            filter: {},
            limit: 20,
            select: "",
            populateId: "",
            populateItems: "",
            lean: false,
            skip: 0,
            where: "",
            gt: 1,
            lt: 0,
            in : [],
            equals:"",
            errorMessage: "Unknown Value",
            delete:[]
        }
    })
    app.use(buildReq.query);
    app.get('/', function(req, res) {
        res.status(200).send(req.queryParameters);
    });
```

### HOW TO USE THE RESPONSE BUILDER
```javascript
app.get('/', function(req, res) {       buildReq.response(res{method:'json',query:req.queryParameters,hostname:req.get('host')+req.path,route:req.route,data:"no data"});        
    })
```
### HOW IT WORKS IN CONJUNCTION - QUERY AND RESPONSE
```javascript
    app.get('/blog', function(req, res) {
        Blog.find(req.queryParameters.filter)
            .sort(req.queryParameters.sort)
            .select(req.queryParameters.select)
            .limit(req.queryParameters.limit)
            .skip(req.queryParameters.skip)
            .exec(function(err,blogs) {
                Blog.count(req.queryParameters.filter,function(err, totalCount){
                    buildReq.response(res,{count:totalCount,method:'json',query:req.queryParameters,hostname:req.get('host')+req.path,route:req.route,data:blogs});
                });
                
            });
    });
```

### RESPONSE LOOKS LIKE THIS IF I USE THIS URL -
//http://localhost:3000/?created=GPS&sort=created&populateItems=author%20content%20author,created
```javascript
    {
        "actions": {
            "reload": {
                "allowed": ["get"],
                "ref": "localhost:3000/?sort=created&created=GPS&populateId=Blog%20Users&populateItems=author%20content%20created"
            }
        },
        "query": {
            "error": {},
            "filter": {
                "created": "GPS"
            },
            "skip": 0,
            "where": "",
            "gt": 1,
            "lt": 0,
            "in": [],
            "lean": false,
            "sort": "created",
            "limit": 30,
            "select": "",
            "populateId": "Blog Users ",
            "populateItems": "author content created "
        },
        "count": 0,
        "itemPerPage": 0,
        "data": [],
        "user": {},
        "type": "",
        "error": {},
        "success": true
    }
```

### RESPONSE LOOKS LIKE THIS IF I USE THIS URL -
//http://localhost:3000/
```javascript
    {
        "actions": {
            "reload": {
                "allowed": ["get"],
                "ref": "localhost:3000/"
            }
        },
        "query": {
            "error": {},
            "filter": {},
            "skip": 0,
            "where": "",
            "gt": 1,
            "lt": 0,
            "in": [],
            "lean": false,
            "sort": "-created",
            "limit": 30,
            "select": "",
            "populateId": "Blog Users ",
            "populateItems": "created title content author _id id __v name email username "
        },
        "count": 0,
        "itemPerPage": 0,
        "data": [],
        "user": {},
        "type": "",
        "error": {},
        "success": true
    }
```

### CHECKOUT THE EXAMPLE IN /EX/APP.JS


#### This is [on GitHub](https://github.com/GreenPioneer/buildreq)
#### Find us [on GitHub](https://github.com/GreenPioneer)
#### Find us [on Twitter](https://twitter.com/greenpioneerdev)
#### Find us [on Facebook](https://www.facebook.com/Green-Pioneer-Solutions-1023752974341910)
#### Find us [on The Web](http://greenpioneersolutions.com/)