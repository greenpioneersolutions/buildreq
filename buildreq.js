(function () {
    'use strict';
    var mongoose = require('mongoose'),
        _ = require('lodash'),
        express = require('express');
    module.exports = {
        query: query,
        response: response,
        error: error,
        config: config,
        routing:routing
    };
    var options = {
        response: {
            method: "get",
            data: {},
            user: {},
            count: 0,
            hostname: "",
            query: {},
            type: "",
            actions: {
                prev: true,
                next: true,
                reload: true
            },
            delete: []
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
            equals: "",
            errorMessage: "Unknown Value",
            delete: [],
            mongoose: true,
            schema: []
        },
        routing:{
            schema:true
        }
    };
    function routing(app) { //Currently just a Sample - Still need to implement
        var subRoutes = _.keys(mongoose.models);
        var apps ={};
        _.forEach(subRoutes,function(n){
            apps[n] = express(); // the sub app
            //ERROR middleware - still need to develop
            apps[n].use(error)
            //GET all
            apps[n].get('/', function (req, res) {
              mongoose.model([n])
                .find(req.queryParameters.filter)
                .sort(req.queryParameters.sort)
                .select(req.queryParameters.select)
                .limit(req.queryParameters.limit)
                .skip(req.queryParameters.skip)
                .exec(function (err, data) {
                    mongoose.model([n]).count(req.queryParameters.filter, function (err, totalCount) {
                        response(res, {
                            count: totalCount,
                            method: 'json',
                            query: req.queryParameters,
                            hostname: req.get('host') + req.path,
                            route: req.route,
                            data: data
                        });
                    });
                });
            })
            //CREATE new
            apps[n].post('/',function(req, res) {
                var data = new mongoose.model([n])(req.body);
                data.save(function(err) {
                    if (err) {
                      return res.status(500).json({
                        error: 'Cannot save the data'
                      });
                    }
                    response(res, {
                        method: 'json',
                        query: req.queryParameters,
                        hostname: req.get('host') + req.path,
                        route: req.route,
                        data: data
                    });
                });
            })

            //UPDATE by ID
            apps[n].put('/:'+n+'Id',function(req, res) {
                var data = req[apps[n]];

                data = _.extend(data, req.body);


                data.save(function(err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot update the data'
                        });
                    }
                    response(res, {
                        method: 'json',
                        query: req.queryParameters,
                        hostname: req.get('host') + req.path,
                        route: req.route,
                        data: data
                    });
                });
            })

            //DELETE by ID
            apps[n].delete('/:'+n+'Id',function(req, res) {
                var data = req[apps[n]];
                data.remove(function(err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot delete the data'
                        });
                    }
                    response(res, {
                        method: 'json',
                        query: req.queryParameters,
                        hostname: req.get('host') + req.path,
                        route: req.route,
                        data: data
                    });
                });
            })

            //SHOW by ID
            apps[n].get('/:'+n+'Id', function (req, res) {
                response(res, {
                    method: 'json',
                    query: req.queryParameters,
                    hostname: req.get('host') + req.path,
                    route: req.route,
                    data: req[apps[n]],
                    type:n
                });
            })
            //PARAM of the ID
            apps[n].param(n+'Id', function(req, res, next, id) {
                if ((!mongoose.Types.ObjectId.isValid(id))) {
                      return res.status(500).send('Parameter passed is not a valid Mongo ObjectId');
                }else{
                    try{
                        mongoose.model([n])
                        .findOne({_id:id}, function(err, data) {
                            if (err) return next(err);
                            if (!data) return next(new Error('Failed to load data ' + id));
                            req[apps[n]] = data;
                            next();
                        });
                    }catch(err){
                        console.log(err)
                        next();
                    }
                }                
            });
            //Mount the routes
            app.use('/api/v1/'+n, apps[n]);

        })
    }

    function error(err, req, res, next) { //Currently just a Sample - Still need to implement
        if (res.headersSent) {
            return next(err);
        }
        res.status(500);
        res.render('error', {
            error: err
        })
    }

    function mongooseCheck() {
        return mongoose.connection.readyState === 0 ? false : true;
    }

    function config(configs) {
        options.query.mongoose = mongooseCheck();
        if (configs) {
            options = _.defaultsDeep(configs, options);
        }

    }

    function response(res, value) {
        var defaults = options.response;
        var response = {};
        response.actions = {};
        var url = '';
        var hostname = value.hostname || defaults.hostname;

        function urlBuilder(data) {
            data = data.trim().replace(/\s/g, "%20");
            if (url === '') {
                url = '?' + data
            } else {
                url += '&' + data;
            }
            return url
        }

        function queryBuilder(skipfield) {
            function skip(field) {
                return skipfield == field ? false : true;
            }
            _.forEach(options.query, function (n, key) {
                if (_.isArray(n)) {
                    _.forEach(value.query[key], function (k, keyArr) {
                        urlBuilder(keyArr + '=' + k)
                    })
                } else if (_.isObject(n)) {
                    _.forEach(value.query[key], function (j, keyObj) {
                        urlBuilder(keyObj + '=' + j)
                    })
                } else if (value.query[key] && value.query[key] !== n) {
                    if (skip(key)) {
                        urlBuilder(key + '=' + value.query[key]);
                    }
                }
            })
        }
        //need to update - known issue http://localhost:3000/api/v1/blog?limit=3
        function reload() {
            if (defaults.actions.reload) {
                url = '';
                queryBuilder();
                response.actions.reload = {
                    allowed: _.keys(value.route.methods),
                    ref: value.hostname + url
                }
            }
        }

        function next(number) {
            if (defaults.actions.next) {
                url = '';
                queryBuilder('skip');
                var dataSkip = parseInt(value.query.limit) + parseInt(value.query.skip);
                if (dataSkip < value.count) {
                    urlBuilder('skip=' + dataSkip);
                    response.actions.next = {
                        allowed: _.keys(value.route.methods),
                        ref: value.hostname + url
                    }
                }
            }
        }

        function prev(number) {
            if (defaults.actions.prev) {
                url = '';
                queryBuilder('skip');
                var dataSkip = parseInt(value.query.skip) - parseInt(value.query.limit);
                if (dataSkip > 0) {
                    urlBuilder('skip=' + dataSkip)
                    response.actions.prev = {
                        allowed: _.keys(value.route.methods),
                        ref: value.hostname + url
                    }
                } else {
                    response.actions.prev = {
                        allowed: _.keys(value.route.methods),
                        ref: value.hostname + url
                    }
                }
            }
        }
        response.query = value.query || defaults.query;
        if (value.data && _.isArray(value.data)) {
            response.count = value.data.length || defaults.count;
            response.itemPerPage = value.data.length;
        }
        response.data = value.data || defaults.data;
        response.user = value.user || defaults.user;
        response.type = value.type || defaults.type;
        response.error = value.error || {};
        response.success = true;

        if (value.count) {
            if (value.data && value.data.length < value.count) {
                reload();
                next(value.data.length);
            } else {
                reload();
            }
            if (value.query.skip !== 0) {
                prev(value.query.skip)
            }
        } else {
            reload();
        }

        _.forEach(defaults.delete, function (n, key) {
            if (_.isString(response[n]) || _.isArray(response[n]) || _.isObject(response[n]) || _.isNumber(response[n])) {
                delete response[n];
            }
        })
        res[value.method](response)
    }

    function query(req, res, next) {

        if (options.query.mongoose === false) {
            options.query.mongoose = mongooseCheck();
        }
        var defaults = options.query;

        var schemas = {};
        var query = req.query;
        var queryParameters = {};
        var schema = []
        var schemaSort = [];
        queryParameters.error = {};
        queryParameters.filter = {};
        if (defaults.mongoose) {
            var models = _.keys(mongoose.models); //mongoose Dependent things
            _.forEach(models, function (n, key) {
                schemas[n] = {}; //currently collecting extra info for later use
                schemas[n].schema = []
                schemas[n].schemaSort = [];
                schemas[n].tree = mongoose.models[n].schema.tree;
                _.forEach(schemas[n].tree, function (j, key) {
                    schema.push(key)
                    schemaSort.push(key)
                    schemaSort.push('-' + key)
                    schemas[n].schema.push(key)
                    schemas[n].schemaSort.push(key)
                    schemas[n].schemaSort.push('-' + key)
                    _.forEach(query, function (a, keys) {
                        if (keys == key) {
                            queryParameters.filter[keys] = a;
                        }
                    })
                })
            })
        } else {
            schemaSort = schema = defaults.schema;
            _.forEach(schema, function (j, key) {
                _.forEach(query, function (a, keys) {
                    if (keys == j) {
                        queryParameters.filter[keys] = a;
                    }
                })
            })
        }


        queryParameters.skip = query.skip || defaults.skip; //SKIP
        queryParameters.where = query.where || defaults.where; //WHERE
        queryParameters.equals = query.equals || defaults.equals; //Equals
        queryParameters.gt = query.gt || defaults.gt; //GT
        queryParameters.lt = query.lt || defaults.lt; //LT
        queryParameters.in = query.in || defaults.in; //IN
        queryParameters.lean = query.lean || defaults.lean; //LEAN
        queryParameters.sort = query.sort ? sortCheck(query.sort) : defaults.sort; //SORT
        function sortCheck(sort) {
            return -1 !== schemaSort.indexOf(sort) ? sort : errorHandler(query.sort, "sort", defaults.sort);
        }
        queryParameters.limit = query.limit ? limitCheck(query.limit) : defaults.limit; //limitCheck
        function limitCheck(number) {
            return number < defaults.limit ? parseInt(number) : errorHandler(query.limit, "limit", defaults.limit);
        }
        queryParameters.select = query.select ? selectCheck(query.select) : defaults.select; //selectCheck
        function selectCheck(select) {
            if (_.isArray(query.select)) {
                var selected = '';
                _.forEach(query.select, function (n, key) {
                    if (schema.indexOf(n) !== -1) {
                        selected += n + ' ';
                    } else {
                        errorHandler(n, "select", defaults.select);
                    };
                });
                return selected;
            } else {
                return -1 !== schema.indexOf(select) ? select : errorHandler(query.select, "select", defaults.select);
            }
        }
        if (defaults.mongoose) { //mongo field - not needed
            queryParameters.populateId = query.populateId ? populateIdCheck(query.populateId) : populateIdCheck(models, true); //populate
            queryParameters.populateItems = query.populateItems ? populateItemsCheck(query.populateItems) : populateItemsCheck(schema, true); //populate
        }

        function populateIdCheck(data, value) {
            var populateId = '';
            if (!_.isArray(data)) {
                data = data.replace(',', ' ').split(" ");
            }
            data = _.uniq(data);
            _.forEach(data, function (n, key) {
                if (models.indexOf(n) !== -1) {
                    populateId += n + ' ';
                } else {
                    errorHandler(n, "populateId", defaults.populateId);
                };
            })
            if (value) options.query.populateId = populateId;
            return populateId;
        }

        function populateItemsCheck(data, value) {
            var populateItems = '';
            if (!_.isArray(data)) {
                data = data.replace(',', ' ').split(" ");
            }
            data = _.uniq(data);
            _.forEach(data, function (n, key) {
                if (schema.indexOf(n) !== -1) {
                    populateItems += n + ' ';
                } else {
                    errorHandler(n, "populateItems", defaults.populateItems);
                };
            })
            if (value) options.query.populateItems = populateItems;
            return populateItems;
        }

        function errorHandler(errvalue, field, value) { //ERRORHANDLER
            if (!queryParameters.error[field]) queryParameters.error[field] = [];
            queryParameters.error[field].push({
                message: defaults.errorMessage,
                value: errvalue
            })
            return value;
        }
        _.forEach(defaults.delete, function (n, key) { //DELETE FIELDS BASED ON CONFIGS
            if (_.isString(queryParameters[n]) || _.isArray(queryParameters[n]) || _.isObject(queryParameters[n]) || _.isNumber(queryParameters[n])) {
                delete queryParameters[n];
            }
        })
        req.queryParameters = queryParameters;

        next();
    };
})();