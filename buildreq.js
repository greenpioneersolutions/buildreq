(function() {
'use strict';
var mongoose = require('mongoose'),
    _ = require('lodash')
module.exports = {
    //get
    query: query,
    response: response,
    error: error,
    config: config
};
var options = {
    response: {
        method: "get",
        data: {},
        user: {},
        count: 0,
        hostname: "",
        query: {},
        type: ""
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
        errorMessage: "Unknown Value"
    }
};

function error(err, req, res, next) {
    //Currently just a Sample - Still need to implement
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render('error', {
        error: err
    })
}

function config(configs) {
    if (configs) {
        options = _.extend(options, configs);
    }
}

function response(res, value) {
    var defaults = {};
    defaults = _.extend(options.response, defaults);

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

    function queryBuilder() {
        _.forEach(options.query, function (n, key) {
            if (_.isArray(n)) {
                _.forEach(value.query[key], function (k, keyArr) {
                    urlBuilder(keyArr + '=' + k)
                })
            } else if (_.isObject(n)) {
                _.forEach(value.query[key], function (j, keyObj) {
                    urlBuilder(keyObj + '=' + j)
                })
            } else if (value.query[key] && value.query[key] !== n) urlBuilder(key + '=' + value.query[key]);
        })
    }

    function reload() {
        url = '';
        queryBuilder()
        response.actions.reload = {
            allowed: _.keys(value.route.methods),
            ref: value.hostname + url
        }
    }

    function next(number) {
        url = '';
        queryBuilder()
        var dataSkip = parseInt(value.query.limit) + parseInt(value.query.skip);
        if (dataSkip < count) {
            urlBuilder('skip=' + dataSkip);
            response.actions.next = {
                allowed: _.keys(value.route.methods),
                ref: value.hostname + url
            }
        }
    }

    function prev(number) {
        url = '';
        queryBuilder()
            //need to fix this to handle more numbers
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
    response.query = value.query || defaults.query;
    if (value.data && _.isArray(value.data)) {
        response.count = value.data.length || defaults.count;
        response.itemPerPage = value.data.length;
    }
    response.data = value.data || defaults.data;
    response.user = value.user || defaults.user;
    response.type = value.user || defaults.type;
    response.error = value.error || {};
    response.success = true;

    if (value.count) {
        if (value.data && value.data.length < count) {
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
    res[value.method](response)
}

function query(req, res, next) {
    var defaults = {};
    defaults = _.extend(defaults, options.query);
    var models = _.keys(mongoose.models);
    var schemas = {};
    var query = req.query;
    var queryParameters = {};
    var schema = []
    var schemaSort = [];
    queryParameters.error = {};
    queryParameters.filter = {};
    _.forEach(models, function (n, key) {
        schemas[n] = {};
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

    //SKIP
    queryParameters.skip = query.skip || defaults.skip;
    //WHERE
    queryParameters.where = query.where || defaults.where;
    //Equals
    queryParameters.equals = query.equals || defaults.equals;
    //GT
    queryParameters.gt = query.gt || defaults.gt;
    //LT
    queryParameters.lt = query.lt || defaults.lt;
    //IN
    queryParameters.in = query.in || defaults.in;
    //LEAN
    queryParameters.lean = query.lean || defaults.lean;
    //SORT
    queryParameters.sort = query.sort ? sortCheck(query.sort) : defaults.sort;

    function sortCheck(sort) {
        return -1 !== schemaSort.indexOf(sort) ? sort : errorHandler(query.sort, "sort", defaults.sort);
    }
    //limitCheck
    queryParameters.limit = query.limit ? limitCheck(query.limit) : defaults.limit;

    function limitCheck(number) {
        //plan to switch out for https://jsperf.com/number-vs-parseint-vs-plus/95 in later version
        return number < defaults.limit ? parseInt(number) : errorHandler(query.limit, "limit", defaults.limit);
    }
    //selectCheck
    queryParameters.select = query.select ? selectCheck(query.select) : defaults.select;

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

    //populate
    queryParameters.populateId = query.populateId ? populateIdCheck(query.populateId) : populateIdCheck(models);
    queryParameters.populateItems = query.populateItems ? populateItemsCheck(query.populateItems) : populateItemsCheck(schema);

    function populateIdCheck(data) {
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

        return populateId;
    }

    function populateItemsCheck(data) {
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

        return populateItems;
    }
    //ERRORHANDLER
    function errorHandler(errvalue, field, value) {
        if (!queryParameters.error[field]) queryParameters.error[field] = [];
        queryParameters.error[field].push({
            message: defaults.errorMessage,
            value: errvalue
        })
        return value;
    }
    req.queryParameters = queryParameters;

    next();
};
})();