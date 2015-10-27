'use strict';
var mongoose = require('mongoose'),
    _ = require('lodash')
module.exports = {
    //get
    query: query,
    config: config
};
var options = {
    sort: "-created",
    limit: 20,
    select: "",
    populateId: "",
    populateItems: ""
};

function config(configs) {
    if (configs) {
        options = _.extend(options, configs);
    }
}

function query(req, res, next) {
    var defaults = {};
    defaults = _.extend(defaults, options);
    var models = _.keys(mongoose.models);
    var schemas = {};
    var query = req.query;
    var queryParameters = {};
    var schema = []
    var schemaSort = [];
    queryParameters.error = {};
    queryParameters.filter = {};
    _.forEach(models, function(n, key) {
            schemas[n] = {};
            schemas[n].schema = []
            schemas[n].schemaSort = [];
            schemas[n].tree = mongoose.models[n].schema.tree;
            _.forEach(schemas[n].tree, function(j, key) {
                schema.push(key)
                schemaSort.push(key)
                schemaSort.push('-' + key)
                schemas[n].schema.push(key)
                schemas[n].schemaSort.push(key)
                schemas[n].schemaSort.push('-' + key)
                _.forEach(query, function(a, keys) {
                    if (keys == key) {
                        queryParameters.filter[keys] = a;
                    }
                })
            })
        })
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
            _.forEach(query.select, function(n, key) {
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
    //SKIP
    queryParameters.skip = query.skip || 0;
    //populate
    queryParameters.populate = {};
    queryParameters.populate.id = query.populateId ? populateIdCheck(query.populateId) : populateIdCheck(models);
    queryParameters.populate.items = query.populateItems ? populateItemsCheck(query.populateItems) : populateItemsCheck(schema);

    function populateIdCheck(data) {
        var populateId = '';
        if (!_.isArray(data)) {
            data = data.split(" ");
        }
        _.forEach(data, function(n, key) {
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
            data = data.split(" ");
        }
        _.forEach(data, function(n, key) {
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
            message: 'Unknown Value',
            value: errvalue
        })
        return value;
    }
    req.queryParameters = queryParameters;
    next();
};