var _ = require('lodash')
var moment = require('moment')

var check = function (settings, req) {
  var mongoose = settings.mongoose
  settings.options.query.mongoose = mongoose.connection.readyState === 0 ? 0 : 1
  var defaults = settings.options.query
  var schemas = {}
  var query = req.query || {}
  var queryParameters = {}
  var schema = []
  var schemaSort = []
  queryParameters.error = {}
  queryParameters.warning = {}
  queryParameters.filter = {}
  var models

  function modelNameCheck (name) {
    return models[models.indexOf(name)]
  }

  if (defaults.mongoose) {
    models = _.keys(mongoose.models) // mongoose Dependent things
    _.forEach(models, function (n, key) {
      schemas[n] = {} // currently collecting extra info for later use
      schemas[n].schema = []
      schemas[n].schemaSort = []
      schemas[n].tree = mongoose.models[n].schema.tree
      schemas[n].paths = mongoose.models[n].schema.paths
      _.forEach(schemas[n].tree, function (j, key) {
        schema.push(key)
        schemaSort.push(key)
        schemaSort.push('-' + key)
        schemas[n].schema.push(key)
        schemas[n].schemaSort.push(key)
        schemas[n].schemaSort.push('-' + key)
        _.forEach(query, function (a, keys) {
          if (keys === key) {
            queryParameters.filter[keys] = a
          }
        })
      })
    })
  } else {
    schemaSort = schema = defaults.schema
    _.forEach(schema, function (j, key) {
      _.forEach(query, function (a, keys) {
        if (keys === j) {
          queryParameters.filter[keys] = a
        }
      })
    })
  }
  var whereParameters = {}
  var whereBoolean = false
  function whereParameter (check, type) {
    if (!_.isUndefined(check)) {
      whereBoolean = true
      whereParameters[type] = check
      return true
    } else {
      return false
    }
  }
  queryParameters.gt = whereParameter(query.gt, '$gt') ? query.gt : defaults.gt // GT
  queryParameters.lt = whereParameter(query.lt, '$lt') ? query.lt : defaults.lt // LT
  queryParameters.gte = whereParameter(query.gte, '$gte') ? query.gte : defaults.gte // GT
  queryParameters.lte = whereParameter(query.lte, '$lte') ? query.lte : defaults.lte // LT
  queryParameters.in = whereParameter(query.in, '$in') ? query.in : defaults.in // IN
  queryParameters.ne = whereParameter(query.ne, '$ne') ? query.ne : defaults.ne // ne
  queryParameters.nin = whereParameter(query.nin, '$nin') ? query.nin : defaults.nin // nin
  queryParameters.regex = whereParameter(query.regex, '$regex') ? query.regex : defaults.regex //  $regex
  queryParameters.options = whereParameter(query.options, '$options') ? query.options : defaults.options //  $options
  queryParameters.size = whereParameter(query.size, '$size') ? query.size : defaults.size //  $size
  queryParameters.all = whereParameter(query.all, '$all') ? query.all : defaults.all //  $all
  queryParameters.equals = whereParameter(query.equals, '$equals') ? query.equals : defaults.equals // Equals
  queryParameters.find = whereParameter(query.find, 'find') ? query.find : defaults.find // find
  function whereCheck (where) {
    var output = {}
    if (whereBoolean) {
      output[where] = {}
      _.forEach(whereParameters, function (n, key) {
        if (key === '$equals') {
          output[where] = valueParser(schemas[modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))].paths[where].instance, n)
        } else if (key === 'find') {
          output[where] = new RegExp(valueParser(schemas[modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))].paths[where].instance, n), 'i')
        } else if (key === '$nin' || key === '$in' || key === '$all') {
          if (_.isArray(n)) {
            output[where][key] = valueParser(schemas[modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))].paths[where].instance, n)
          } else {
            output[where][key] = [valueParser(schemas[modelNameCheck(_.replace(req.path, settings.options.routing.url, ''))].paths[where].instance, n)]
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
  if (!_.isArray(query.where)) {
    queryParameters.where = query.where ? whereCheck(query.where) : defaults.where // WHERE
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
          if (_.isEmpty(ArrayWhere[lastWhere])) ArrayWhere[lastWhere] = contents[1]
          else warningHandler(contents[1] + '- Equals command does not pair with any other commands', 'Where-Equals', '')
        } else if (contents[0] === 'find') {
          if (_.isEmpty(ArrayWhere[lastWhere])) ArrayWhere[lastWhere] = new RegExp(contents[1], 'i')
          else warningHandler(contents[1] + '- Find command does not pair with any other commands', 'Where-Find', '')
        } else if (contents[0] === 'nin' || contents[0] === 'in' || contents[0] === 'all') {
          if (_.isArray(contents[1])) {
            ArrayWhere[lastWhere]['$' + contents[0]] = contents[1]
          } else {
            ArrayWhere[lastWhere]['$' + contents[0]] = [contents[1]]
          }
        } else if (contents[0] === 'gt' || contents[0] === 'lt' || contents[0] === 'gte' || contents[0] === 'lte' || contents[0] === 'ne' || contents[0] === 'regex' || contents[0] === 'options' || contents[0] === 'size') {
          ArrayWhere[lastWhere]['$' + contents[0]] = contents[1]
        }
      }
    })
    queryParameters.where = ArrayWhere
  }
  queryParameters.aggregate = query.aggregate ? aggregateCheck(query.aggregate) : defaults.aggregate // WHERE
  function aggregateCheck (aggregated) {
    var output = []

    _.forEach(aggregated, function (n, key) {
      var aggregate = {}
      aggregate[key] = n
      output.push(aggregate)
    })
    return output
  }
  queryParameters.lean = query.lean || defaults.lean // LEAN
  queryParameters.skip = parseInt(query.skip, 10) || defaults.skip // SKIP

  queryParameters.sort = query.sort ? sortCheck(query.sort) : defaults.sort // SORT
  function sortCheck (sort) {
    return schemaSort.indexOf(sort) !== -1 ? sort : errorHandler(query.sort, 'sort', defaults.sort)
  }
  queryParameters.limit = query.limit ? limitCheck(query.limit) : defaults.limit // limitCheck
  function limitCheck (number) {
    return number < defaults.limit ? parseInt(number, 10) : errorHandler(query.limit + ' is over the default limit of ' + defaults.limit, 'limit', defaults.limit)
  }
  queryParameters.select = query.select ? selectCheck(query.select) : defaults.select // selectCheck
  function selectCheck (select) {
    if (_.isArray(query.select)) {
      var selected = ''
      _.forEach(query.select, function (n, key) {
        if (schema.indexOf(n) !== -1) {
          selected += n + ' '
        } else {
          errorHandler(n, 'select', defaults.select)
        }
      })
      return selected
    } else {
      return schema.indexOf(select) !== -1 ? select : errorHandler(query.select, 'select', defaults.select)
    }
  }
  if (defaults.mongoose) { // mongo field - not needed
    queryParameters.populateId = query.populateId ? populateIdCheck(query.populateId) : populateIdCheck('', true) // models
    queryParameters.populateItems = query.populateItems ? populateItemsCheck(query.populateItems) : populateItemsCheck('', true) // schema
    queryParameters.deepPopulate = query.deepPopulate ? query.deepPopulate : defaults.deepPopulate // add schema check for deepPop
  }

  function populateIdCheck (data, value) {
    var populateId = ''
    if (!_.isArray(data)) {
      data = data.replace(',', ' ').split(' ')
    }
    var defaultIds = []
    if (!_.isArray(defaults.populateId)) {
      defaultIds = defaults.populateId.replace(',', ' ').split(' ')
    }
    if (defaults.populateId) {
      data = _.union(data, defaultIds)
    }

    _.forEach(data, function (n, key) {
      if (models.indexOf(n) !== -1 || schema.indexOf(n) !== -1) {
        populateId += n + ' '
      } else {
        if (n)warningHandler(n, 'populateId - Not in schemas provided', defaults.populateId)
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
    var defaultIds = []
    if (!_.isArray(defaults.populateItems)) {
      defaultIds = defaults.populateItems.replace(',', ' ').split(' ')
    }
    if (defaults.populateItems) {
      data = _.union(data, defaultIds)
    }
    _.forEach(data, function (n, key) {
      if (schema.indexOf(n) !== -1) {
        populateItems += n + ' '
      } else {
        if (n)warningHandler(n, 'populateItems', defaults.populateItems)
      }
    })
    if (value) settings.options.query.populateItems = populateItems
    return populateItems
  }

  function errorHandler (errValue, field, value) { // ERRORHANDLER
    if (!queryParameters.error[field]) queryParameters.error[field] = []
    queryParameters.error[field].push({
      message: defaults.errorMessage,
      value: errValue
    })
    return value
  }

  function warningHandler (warnValue, field, value) { // warningHandler
    if (!queryParameters.warning[field]) queryParameters.warning[field] = []
    queryParameters.warning[field].push({
      message: defaults.warningMessage,
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

  _.forEach(defaults.delete, function (n, key) { // DELETE FIELDS BASED ON CONFIGS
    if (_.isString(queryParameters[n]) || _.isArray(queryParameters[n]) || _.isObject(queryParameters[n]) || _.isNumber(queryParameters[n])) {
      delete queryParameters[n]
    }
  })
  return queryParameters
}
function queryMiddlewareFunc (setup) {
  return function queryMiddleware (req, res, next) {
    var settings = setup()
    req.queryParameters = check(settings, req)
    next()
  }
}
function query (setup) {
  var settings = setup()
  return check(settings, settings.req)
}
module.exports = {
  query: query,
  queryMiddleware: queryMiddlewareFunc
}
