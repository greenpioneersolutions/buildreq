# BuildREQ

## R - Response - N/A
## E - Error - WORKING
## Q - Query - WORKING

Created by ![Green Pioneer](http://greenpioneersolutions.com/img/icons/apple-icon-180x180.png)

### More to come soon here
Currently only the Query builder Response builder are only Implemented

## Code Needed To Run BuildREQ - QUERY
```javascript
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

	app.use(buildReq.query);


	app.get('/', function(req, res) {
	    Blog.find()
	        .exec()
	        .then(function(blogs) {
	            buildReq.response(res,{method:'json',query:req.queryParameters,hostname:req.get('host')+req.path,route:req.route,data:blogs});
	        });
	});
	

	//RESPONSE LOOKS LIKE THIS IF I USE THIS URL -
	//http://localhost:3000/?created=GPS&sort=created&populateItems=author%20content%20author,created
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




	//RESPONSE LOOKS LIKE THIS IF I USE THIS URL -
	//http://localhost:3000/
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

Todo List

 * Add Error Builder
 * Add Refactor
 * Add Get Production Ready



#### This is [on GitHub](https://github.com/GreenPioneer/buildreq)
#### Find us [on GitHub](https://github.com/GreenPioneer)
#### Find us [on Twitter](https://twitter.com/greenpioneerdev)
#### Find us [on Facebook](https://www.facebook.com/Green-Pioneer-Solutions-1023752974341910)
#### Find us [on The Web](http://greenpioneersolutions.com/)