var mongoose = require('mongoose'),
    _ = require('lodash'),
    express = require('express');

function routing(setup) {
    var settings = setup();
    var subRoutes = _.keys(mongoose.models);
    var apps = {};
    _.forEach(subRoutes, function (n) {
        apps[n] = express(); // the sub app
        //ERROR middleware - still need to develop
        apps[n].use(settings.error())
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
                            settings.response(res, {
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
        apps[n].post('/', function (req, res) {
            var data = new mongoose.model([n])(req.body);
            data.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the data'
                    });
                }
                settings.response(res, {
                    method: 'json',
                    query: req.queryParameters,
                    hostname: req.get('host') + req.path,
                    route: req.route,
                    data: data
                });
            });
        })

        //UPDATE by ID
        apps[n].put('/id/:' + n + 'Id', function (req, res) {
            var data = req[apps[n]];

            data = _.extend(data, req.body);


            data.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the data'
                    });
                }
                settings.response(res, {
                    method: 'json',
                    query: req.queryParameters,
                    hostname: req.get('host') + req.path,
                    route: req.route,
                    data: data
                });
            });
        })

        //DELETE by ID
        apps[n].delete('/id/:' + n + 'Id', function (req, res) {
            var data = req[apps[n]];
            data.remove(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the data'
                    });
                }
                settings.response(res, {
                    method: 'json',
                    query: req.queryParameters,
                    hostname: req.get('host') + req.path,
                    route: req.route,
                    data: data
                });
            });
        })

        //SHOW by ID
        apps[n].get('/id/:' + n + 'Id', function (req, res) {
                settings.response(res, {
                    method: 'json',
                    query: req.queryParameters,
                    hostname: req.get('host') + req.path,
                    route: req.route,
                    data: req[apps[n]],
                    type: n
                });
            })
            //PARAM of the ID
        apps[n].param(n + 'Id', function (req, res, next, id) {
            if ((!mongoose.Types.ObjectId.isValid(id))) {
                return res.status(500).send('Parameter passed is not a valid Mongo ObjectId');
            } else {
                try {
                    mongoose.model([n])
                        .findOne({
                            _id: id
                        }, function (err, data) {
                            if (err) return next(err);
                            if (!data) return next(new Error('Failed to load data ' + id));
                            req[apps[n]] = data;
                            next();
                        });
                } catch (err) {
                    console.log(err)
                    next();
                }
            }
        });

        //show fields
        apps[n].get('/fields/', function (req, res) {
            settings.response(res, {
                method: 'json',
                query: req.queryParameters,
                hostname: req.get('host') + req.path,
                route: req.route,
                data: _.keys(mongoose.model([n]).schema.tree),
                type: n
            });
        })

        //options
        apps[n].get('/options/', function (req, res) {
                settings.response(res, {
                    method: 'json',
                    query: req.queryParameters,
                    hostname: req.get('host') + req.path,
                    route: req.route,
                    data: _.keys(mongoose.model([n]).schema.options),
                    type: n
                });
            })
            //_indexes
        apps[n].get('/_indexes/', function (req, res) {
                settings.response(res, {
                    method: 'json',
                    query: req.queryParameters,
                    hostname: req.get('host') + req.path,
                    route: req.route,
                    data: _.keys(mongoose.model([n]).schema._indexes),
                    type: n
                });
            })
            //Mount the routes
        settings.app.use('/api/v1/' + n, apps[n]);
    })
}
module.exports = routing;