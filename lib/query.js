var mongoose = require('mongoose')
var _ = require('lodash')

function query (setup) {
  return function queryMiddleware (req, res, next) {
    var settings = setup()
    settings.options.query.mongoose = mongoose.connection.readyState === 0 ? 0 : 1
    var defaults = settings.options.query
    var schemas = {}
    var query = req.query
    var queryParameters = {}
    var schema = []
    var schemaSort = []
    queryParameters.error = {}
    queryParameters.filter = {}
    if (defaults.mongoose) {
      var models = _.keys(mongoose.models) // mongoose Dependent things
      _.forEach(models, function (n, key) {
        schemas[n] = {} // currently collecting extra info for later use
        schemas[n].schema = []
        schemas[n].schemaSort = []
        schemas[n].tree = mongoose.models[n].schema.tree
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

    queryParameters.where = query.where ? whereCheck(query.where) : defaults.where // WHERE
    function whereCheck (where) {
      var output = {}
      if (whereBoolean) {
        output[where] = {}
        _.forEach(whereParameters, function (n, key) {
          if (key === '$equals') {
            output[where] = n
          }else if (key === 'find') {
            output[where] = new RegExp(n, 'i')
          }else if (key === '$nin' || key === '$in' || key === '$all') {
            if (_.isArray(n)) {
              output[where][key] = n
            } else {
              output[where][key] = [n]
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
    queryParameters.aggregate = query.aggregate ? aggregateCheck(query.aggregate) : defaults.aggregate // WHERE
    function aggregateCheck (aggregated) {
      var output = []

      _.forEach(aggregated, function (n, key) {
        var aggregate = {}
        aggregate[key] = n
        output.push(aggregate)
      })

      console.log(output)
      return output
    }
    queryParameters.lean = query.lean || defaults.lean // LEAN
    queryParameters.skip = query.skip || defaults.skip // SKIP

    queryParameters.sort = query.sort ? sortCheck(query.sort) : defaults.sort // SORT
    function sortCheck (sort) {
      return schemaSort.indexOf(sort) !== -1 ? sort : errorHandler(query.sort, 'sort', defaults.sort)
    }
    queryParameters.limit = query.limit ? limitCheck(query.limit) : defaults.limit // limitCheck
    function limitCheck (number) {
      return number < defaults.limit ? parseInt(number, 10) : errorHandler(query.limit, 'limit', defaults.limit)
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
      queryParameters.populateId = query.populateId ? populateIdCheck(query.populateId) : populateIdCheck(models, true) // populate
      queryParameters.populateItems = query.populateItems ? populateItemsCheck(query.populateItems) : populateItemsCheck(schema, true) // populate
    }

    function populateIdCheck (data, value) {
      var populateId = ''
      if (!_.isArray(data)) {
        data = data.replace(',', ' ').split(' ')
      }
      data = _.uniq(data)
      _.forEach(data, function (n, key) {
        if (models.indexOf(n) !== -1) {
          populateId += n + ' '
        } else {
          errorHandler(n, 'populateId', defaults.populateId)
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
      data = _.uniq(data)
      _.forEach(data, function (n, key) {
        if (schema.indexOf(n) !== -1) {
          populateItems += n + ' '
        } else {
          errorHandler(n, 'populateItems', defaults.populateItems)
        }
      })
      if (value) settings.options.query.populateItems = populateItems
      return populateItems
    }

    function errorHandler (errvalue, field, value) { // ERRORHANDLER
      if (!queryParameters.error[field]) queryParameters.error[field] = []
      queryParameters.error[field].push({
        message: defaults.errorMessage,
        value: errvalue
      })
      return value
    }
    _.forEach(defaults.delete, function (n, key) { // DELETE FIELDS BASED ON CONFIGS
      if (_.isString(queryParameters[n]) || _.isArray(queryParameters[n]) || _.isObject(queryParameters[n]) || _.isNumber(queryParameters[n])) {
        delete queryParameters[n]
      }
    })
    req.queryParameters = queryParameters

    next()
  }
}
module.exports = query
