var _ = require('lodash')
var moment = require('moment')
var auto = require('run-auto')
var debug = require('debug')('buildreq:query')

var check = function (settings, req, callback) {
  debug('start query check')
  var whereParameters = {}
  var whereBoolean = false
  var query = req.query || {}
  var queryParameters = {}
  queryParameters.error = {}
  queryParameters.warning = {}
  queryParameters.filter = {}
  auto({
    filter: function (cb) {
      _.forEach(query, function (a, keys) {
        if (settings.schema.indexOf(keys) !== -1) {
          queryParameters.filter[keys] = a
        }
      })
      cb(null, queryParameters.filter)
    },
    gt: function (cb) {
      cb(null, whereParameter(query.gt, '$gt') ? query.gt : settings.defaults.gt)
    },
    lt: function (cb) {
      cb(null, whereParameter(query.lt, '$lt') ? query.lt : settings.defaults.lt)
    },
    gte: function (cb) {
      cb(null, whereParameter(query.gte, '$gte') ? query.gte : settings.defaults.gte)
    },
    lte: function (cb) {
      cb(null, whereParameter(query.lte, '$lte') ? query.lte : settings.defaults.lte)
    },
    in: function (cb) {
      cb(null, whereParameter(query.in, '$in') ? query.in : settings.defaults.in)
    },
    ne: function (cb) {
      cb(null, whereParameter(query.ne, '$ne') ? query.ne : settings.defaults.ne)
    },
    nin: function (cb) {
      cb(null, whereParameter(query.nin, '$nin') ? query.nin : settings.defaults.nin)
    },
    regex: function (cb) {
      cb(null, whereParameter(query.regex, '$regex') ? query.regex : settings.defaults.regex)
    },
    options: function (cb) {
      cb(null, whereParameter(query.options, '$options') ? query.options : settings.defaults.options)
    },
    size: function (cb) {
      cb(null, whereParameter(query.size, '$size') ? query.size : settings.defaults.size)
    },
    all: function (cb) {
      cb(null, whereParameter(query.all, '$all') ? query.all : settings.defaults.all)
    },
    equals: function (cb) {
      cb(null, whereParameter(query.equals, '$equals') ? query.equals : settings.defaults.equals)
    },
    find: function (cb) {
      cb(null, whereParameter(query.find, 'find') ? query.find : settings.defaults.find)
    },
    aggregate: function (cb) {
      cb(null, query.aggregate ? aggregateCheck(query.aggregate) : settings.defaults.aggregate)
    },
    lean: function (cb) {
      cb(null, query.lean || settings.defaults.lean)
    },
    skip: function (cb) {
      cb(null, parseInt(query.skip, 10) || settings.defaults.skip)
    },
    sort: function (cb) {
      cb(null, query.sort ? sortCheck(query.sort) : settings.defaults.sort)
    },
    limit: function (cb) {
      cb(null, query.limit ? limitCheck(query.limit) : settings.defaults.limit)
    },
    select: function (cb) {
      cb(null, query.select ? selectCheck(query.select) : settings.defaults.select)
    },
    populateId: function (cb) {
      if (settings.defaults.mongoose)cb(null, query.populateId ? populateIdCheck(query.populateId) : populateIdCheck('', true)) // models
      else cb(null, '')
    },
    populateItems: function (cb) {
      if (settings.defaults.mongoose)cb(null, query.populateItems ? populateItemsCheck(query.populateItems) : populateItemsCheck('', true)) // settings.schema
      else cb(null, '')
    },
    deepPopulate: function (cb) {
      if (settings.defaults.mongoose) cb(null, query.deepPopulate ? query.deepPopulate : settings.defaults.deepPopulate) // add settings.schema check for deepPop
      else cb(null, '')
    },
    where: ['gt', 'lt', 'gte', 'lte', 'in', 'ne', 'nin', 'regex', 'options', 'size', 'all', 'equals', 'find', function (results, cb) {
      if (!_.isArray(query.where)) {
        cb(null, query.where ? whereCheck(query.where) : settings.defaults.where)
      } else {
        var splitPath = _.split(req.originalUrl, '?')
        var trimPath = _.trimStart(req.originalUrl, splitPath[0] + '?')
        var splitUrlVariables = _.split(trimPath, '&')
        var ArrayWhere = {}
        var lastWhere = ''
        _.forEach(splitUrlVariables, function (newWhere) {
          var contents = _.split(newWhere, '=')
          if (contents[0].toLowerCase() === 'where') {
            lastWhere = contents[1]
            ArrayWhere[lastWhere] = {}
          } else {
            if (contents[0] === 'equals') {
              try {
                if (_.isEmpty(ArrayWhere[lastWhere])) ArrayWhere[lastWhere] = contents[1]
                else warningHandler(contents[1] + '- Equals command does not pair with any other commands', 'Where-Equals', '')
              } catch (err) {
                warningHandler(contents[1] + '- Equals command error', 'Where', err)
              }
            } else if (contents[0] === 'find') {
              try {
                if (_.isEmpty(ArrayWhere[lastWhere])) ArrayWhere[lastWhere] = new RegExp(_.escapeRegExp(contents[1]), 'i')
                else warningHandler(contents[1] + '- Find command does not pair with any other commands', 'Where-Find', '')
              } catch (err) {
                warningHandler(contents[1] + '- find command error', 'Where', err)
              }
            } else if (contents[0] === 'nin' || contents[0] === 'in' || contents[0] === 'all') {
              try {
                if (_.isArray(contents[1])) {
                  ArrayWhere[lastWhere]['$' + contents[0]] = contents[1]
                } else {
                  ArrayWhere[lastWhere]['$' + contents[0]] = [contents[1]]
                }
              } catch (err) {
                warningHandler(contents[1] + '- NIN|IN|ALL command error', 'Where', err)
              }
            } else if (contents[0] === 'gt' || contents[0] === 'lt' || contents[0] === 'gte' || contents[0] === 'lte' || contents[0] === 'ne' || contents[0] === 'regex' || contents[0] === 'options' || contents[0] === 'size') {
              try {
                ArrayWhere[lastWhere]['$' + contents[0]] = contents[1]
              } catch (err) {
                warningHandler(contents[1] + '- GT|LT|GTE|LTE|NE|REGEX|OPTIONS|SIZE command error', 'Where', err)
              }
            }
          }
        })
        cb(null, ArrayWhere)
      }
    }]
  }, function (error, results) {
    if (error)console.log(error)
    _.forEach(settings.defaults.delete, function (n, key) { // DELETE FIELDS BASED ON CONFIGS
      if (_.isString(results[n]) || _.isArray(results[n]) || _.isObject(results[n]) || _.isNumber(results[n])) {
        delete results[n]
      }
    })
    callback(_.merge(results, queryParameters))
  })

  function whereParameter (check, type) {
    if (!_.isUndefined(check)) {
      whereBoolean = true
      whereParameters[type] = check
      return true
    } else {
      return false
    }
  }
  function whereCheck (where) {
    var output = {}
    if (whereBoolean) {
      output[where] = {}
      _.forEach(whereParameters, function (n, key) {
        if (key === '$equals') {
          try {
            output[where] = valueParser(settings.schemas[settings.modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))].paths[where].instance, n)
          } catch (err) {
            warningHandler(where + '- The Where selector appears to be the problem', 'Where$equals', err)
          }
        } else if (key === 'find') {
          try {
            if (settings.modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))) {
              output[where] = new RegExp(_.escapeRegExp(valueParser(settings.schemas[settings.modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))].paths[where].instance, n)), 'i')
            } else {
              if (settings.options.query.strict) {
                if (settings.schema.indexOf(where) !== -1) {
                  output[where] = n
                } else {
                  warningHandler(where + '- The Where Find is not in the schema - strict mode on ', 'WhereFind', 'err')
                }
              } else {
                output[where] = n
              }
            }
          } catch (err) {
            warningHandler(where + '- The Where selector appears to be the problem', 'Where-find', err)
          }
        } else if (key === '$nin' || key === '$in' || key === '$all') {
          try {
            if (_.isArray(n)) {
              if (settings.modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))) {
                output[where][key] = valueParser(settings.schemas[settings.modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))].paths[where].instance, n)
              } else {
                if (settings.options.query.strict) {
                  if (settings.schema.indexOf(where) !== -1) {
                    output[where][key] = n
                  } else {
                    warningHandler(where + '- The Where $nin $in $all is not in the schema - strict mode on ', 'Whereinall', 'err')
                  }
                } else {
                  output[where][key] = n
                }
              }
            } else {
              if (settings.modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))) {
                output[where][key] = [valueParser(settings.schemas[settings.modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))].paths[where].instance, n)]
              } else {
                if (settings.options.query.strict) {
                  if (settings.schema.indexOf(where) !== -1) {
                    output[where][key] = [n]
                  } else {
                    warningHandler(where + '- The Where $nin $in $all is not in the schema - strict mode on ', 'WhereEinall', 'err')
                  }
                } else {
                  output[where][key] = [n]
                }
              }
            }
          } catch (err) {
            warningHandler(where + '- The Where selector appears to be the problem', 'Where-all', err)
          }
        } else {
          output[where][key] = n
        }
      })
    } else {
      output = where
    }
    return output
  }

  function aggregateCheck (aggregated) {
    var output = []

    _.forEach(aggregated, function (n, key) {
      var aggregate = {}
      aggregate[key] = n
      output.push(aggregate)
    })
    return output
  }

  function sortCheck (sort) {
    if (settings.options.query.strict) {
      return settings.schemaSort.indexOf(sort) !== -1 ? sort : errorHandler(query.sort, 'sort', settings.defaults.sort)
    } else {
      return sort
    }
  }

  function limitCheck (number) {
    if (settings.options.query.strict) {
      return number < settings.defaults.limit ? parseInt(number, 10) : errorHandler(query.limit + ' is over the default limit of ' + settings.defaults.limit, 'limit', settings.defaults.limit)
    } else {
      return parseInt(number, 10)
    }
  }

  function selectCheck (select) {
    if (_.isArray(query.select)) {
      var selected = ''
      _.forEach(query.select, function (n, key) {
        if (settings.schema.indexOf(n) !== -1) {
          selected += n + ' '
        } else {
          if (settings.options.query.strict) {
            errorHandler(n, 'select', settings.defaults.select)
          } else {
            selected += n + ' '
          }
        }
      })
      return selected
    } else {
      return settings.schema.indexOf(select) !== -1 ? select : errorHandler(query.select, 'select', settings.defaults.select)
    }
  }

  function populateIdCheck (data, value) {
    var populateId = ''
    if (!_.isArray(data)) {
      data = data.replace(',', ' ').split(' ')
    }
    var defaultIds = []
    if (!_.isArray(settings.defaults.populateId)) {
      defaultIds = settings.defaults.populateId.replace(',', ' ').split(' ')
    }
    if (settings.defaults.populateId) {
      data = _.union(data, defaultIds)
    }
    var limitToPopulateId = []
    if (!_.isArray(settings.defaults.limitToPopulateId)) {
      limitToPopulateId = _.split(_.replace(settings.defaults.limitToPopulateId, ',', ' '), ' ')
    }
    var limitToPopulateItems = []
    if (!_.isArray(settings.defaults.limitToPopulateItems)) {
      limitToPopulateItems = _.split(_.replace(settings.defaults.limitToPopulateItems, ',', ' '), ' ')
    }
    var schema = settings.schema
    var models = settings.models
    if (settings.defaults.limitToPopulateId) {
      models = limitToPopulateId
    }
    if (settings.defaults.limitToPopulateItems) {
      schema = limitToPopulateItems
    }
    _.forEach(data, function (n, key) {
      if (models.indexOf(n) !== -1 || schema.indexOf(n) !== -1) {
        populateId += n + ' '
      } else {
        if (settings.options.query.strict) {
          if (n)warningHandler(n + ' not in the schema or model', 'populateId', settings.defaults.populateId)
        } else {
          populateId += n + ' '
        }
      }
    })
    if (value) settings.options.query.populateId = populateId
    return populateId
  }

  function populateItemsCheck (data, value) {
    var populateItems = ''
    if (!_.isArray(data)) {
      data = data.replace(',', ' ').split(' ')
    }
    var defaultItems = []
    if (!_.isArray(settings.defaults.populateItems)) {
      defaultItems = settings.defaults.populateItems.replace(',', ' ').split(' ')
    }
    if (settings.defaults.populateItems) {
      data = _.union(data, defaultItems)
    }
    var limitToPopulateItems = []
    if (!_.isArray(settings.defaults.limitToPopulateItems)) {
      limitToPopulateItems = _.split(_.replace(settings.defaults.limitToPopulateItems, ',', ' '), ' ')
    }
    var schema = settings.schema
    if (settings.defaults.limitToPopulateItems) {
      schema = limitToPopulateItems
    }
    _.forEach(data, function (n, key) {
      if (schema.indexOf(n) !== -1) {
        populateItems += n + ' '
      } else {
        if (settings.options.query.strict) {
          if (n)warningHandler(n + ' not in the schema', 'populateItems', settings.defaults.populateItems)
        } else {
          populateItems += n + ' '
        }
      }
    })
    if (value) settings.options.query.populateItems = populateItems
    return populateItems
  }

  function errorHandler (errValue, field, value) { // ERRORHANDLER
    if (!queryParameters.error[field]) queryParameters.error[field] = []
    queryParameters.error[field].push({
      message: settings.defaults.errorMessage,
      value: errValue
    })
    return value
  }

  function warningHandler (warnValue, field, value) { // warningHandler
    if (!queryParameters.warning[field]) queryParameters.warning[field] = []
    queryParameters.warning[field].push({
      message: settings.defaults.warningMessage,
      value: warnValue
    })
    return value
  }
  function valueParser (type, value) {
    if (type === 'Number') {
      return _.toNumber(value)
    } else if (type === 'Boolean') {
      if (value === '0' || value === '1') {
        return !!_.replace(value, /[""'']/ig, '')
      } else {
        return _.replace(_.trim(value.toLowerCase()), /[""'']/ig, '') === 'true'
      }
    } else if (type === 'String') {
      return value
    } else if (type === 'ObjectId') {
      return value
    } else if (type === 'Date') {
      return moment(value).format()
    } else {
      return value
    }
  }
}
function queryMiddlewareFunc (setup) {
  return function queryMiddleware (req, res, next) {
    check(setup(), req, function (data) {
      req.queryParameters = data
      next()
    })
  }
}
function query (setup) {
  var settings = setup()
  return check(settings, settings.req, function (data) {
    return data
  })
}
module.exports = {
  query: query,
  queryMiddleware: queryMiddlewareFunc
}
