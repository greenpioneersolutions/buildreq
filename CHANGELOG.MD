### 0.9.2(2016-02-12)
PRE RELEASE

#### Issues
* ** #3 Update the Where Operator to handle multiple where's ** 

### 0.9.1(2016-02-01)
PRE RELEASE

#### Issues
* ** #1 Update Query to not mandate populate Id & Items **
* ** #2 Updated the Response to all the change of status ** 

### 0.9.0(2016-01-26)
PRE RELEASE

#### Features
* **Update Query Middleware Function:** 
* **Update Query Standalone Function:**
* **Update Response Middleware Function:**
* **Update Response Standalone Function:**
* **Added Testing:**


### 0.4.44(2016-01-25)

#### Bug Fix
* **Update Action:** Update to enable actions again because there fixed
* **Update Count:** Update to the count to be async.parallel to handle the get and count
* **Update Error & Warning:** Update the handlers
* **Update PopulateId&Items:** Update them to handle warnings properly

#### Features
* **Clean Up:**Skip , Limit & the Example

### 0.4.43(2016-01-21)

#### Bug Fix
* **Update Query Populate:** Update to all the defaults to be seen & Schema names not just model names

### 0.4.42(2016-01-17)

#### Bug Fix
* **Update Query :** Inject Mongoose to ensure models make it to the query

### 0.4.41(2016-01-14)

#### Bug Fix
* **Remove :** Async
### 0.4.4(2016-01-11)

#### Bug Fix
* **Add :** Async

### 0.4.33(2016-01-08)

#### Bug Fix
* **Routing :** Populate naming error 

### 0.4.32(2016-01-04)

#### Bug Fix
* **Routing :** Populate not called 

### 0.4.31(2016-01-01)

#### Bug Fix
* **Routing :** Fields Call - delete had dynamic failures

### 0.4.3(2015-12-15)

#### Features
* **Updated :** Routing /task/fields to response with instances & isRequired which will help to make your frontend dynamic

### 0.4.2(2015-12-14)

#### Features
* **Added :** error handling for the routing configurations

#### Bug Fix
* **Routing :** Promise.each error fixed

### 0.4.1(2015-12-13)

#### Features
* **Added :** Remove Model feature to routing
* **Updated :** The options for how routing is called


### 0.4.0(2015-12-13)

#### Features
* **Added :** Aggregate Framework(Mongodb) to use for query builder
* **Added :** Aggregate Framework(Mongodb) to use for routing builder
* **Added :** Middleware options to the routing builder( auth , noauth & all)
* **Added :** Routing to handle callbacks

### 0.3.0(2015-12-7)

#### Features
* **Promises :** Implemented with bluebird
* **Added :** count route 
* **Added :** where .find 
* **Added :** Helmet for security 
* **Added :** Compression for speed  
* **Updated :** create route to use mongoose.create()
* **Updated :** examples

### 0.2.0(2015-12-2)

#### Features
* **Where :** to allow customizations
* **gt:** Working Config with WHERE
* **gte:** Working Config with WHERE
* **lte:** Working Config with WHERE
* **lt:** Working Config with WHERE
* **in:** Working Config with WHERE
* **ne:** Working Config with WHERE
* **nin:** Working Config with WHERE
* **regex:** Working Config with WHERE
* **options:** Working Config with WHERE
* **size:** Working Config with WHERE
* **all:** Working Config with WHERE
* **equals:** Working Config with WHERE


### 0.1.3(2015-11-28)

#### Features

* **Mounting :** to allow customization to automatically mount for you. Return all mounts now
* **Routing :** added Body Parser and Method Override to Routing

### 0.1.2(2015-11-20)

#### Features

* **Updated the Url Routing :** to allow customization of the default url route
* **Updated the Urls :** using keyword task on some utility calls

### 0.1.1(2015-11-19)

#### Features

* **Updated the Dynamic Routing :** to allow mongoose to be injected

### 0.0.5 & 0.0.6 (2015-11-5)

#### Features

* **Updated the dynamic Api :** to expose some of mongoose

### 0.0.4 (2015-11-2)

#### Features

* **Dynamic Api based off Schema:**  makes it so no coding needed for a full api(CRUD) ([baa1617](https://github.com/GreenPioneer/buildreq/commit/dcde3e48dc44da3a31c6fac6e20ed36111d2d3cb))

### 0.0.3 (2015-10-29)

#### Features

* **Clean up:**  Code ([d2ac5ff](https://github.com/GreenPioneer/buildreq/commit/86d8ffeb3123e35eb1ebd8fd0be43ee94bfeb27a))

### 0.0.2 (2015-10-28)

#### Features

* **Updated :** to have delete fields, default skips & handle actions([80a722a](https://github.com/GreenPioneer/buildreq/commit/86d8ffeb3123e35eb1ebd8fd0be43ee94bfeb27a))

### 0.0.1 (2015-10-28)

#### Features

* **Query Builder:**  with resolved values ([95f1f72](https://github.com/GreenPioneer/buildreq/commit/86d8ffeb3123e35eb1ebd8fd0be43ee94bfeb27a))
* **Response Builder:**  with resolved values ([545b7a0](https://github.com/GreenPioneer/buildreq/commit/545b7a0c461da7d74507920ced32b5dc552e7c0e))
