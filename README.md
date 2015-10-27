# BuildREQ

## R - Response - NA
## E - Error - N/A
## Q - Query - WORKING

Created by ![Green Pioneer](http://greenpioneersolutions.com/img/icons/apple-icon-180x180.png)

### More to come soon here
Currently only the Query builder is only implemented

## Code Needed To Run BuildREQ - QUERY
```javascript
	buildReq.config({
	    sort: "-created",
	    limit: 30,
	    select: "",
	    populateId: "",
	    populateItems: ""
	})

	app.use(buildReq.query);


	app.get('/', function(req, res) {
	    res.json(req.queryParameters);
	});
	
```

Todo List

 * Add Response Builder
 * Add Error Builder
 * Add Refactor
 * Add Get Production Ready



#### This is [on GitHub](https://github.com/GreenPioneer/buildreq)
#### Find us [on GitHub](https://github.com/GreenPioneer)
#### Find us [on Twitter](https://twitter.com/greenpioneerdev)
#### Find us [on Facebook](https://www.facebook.com/Green-Pioneer-Solutions-1023752974341910)
#### Find us [on The Web](http://greenpioneersolutions.com/)